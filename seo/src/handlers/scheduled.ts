/**
 * VoiceFleet SEO - Scheduled Content Generation Handler
 * Runs daily at 2am UTC to generate fresh AI content for SEO pages
 * Enhanced with Google News RSS for current industry trends
 */

import { INDUSTRIES, getIndustrySlugs } from '../data/industries';
import { getAllCities } from '../data/locations';
import { Bindings, ContentRequest, NewsArticle } from '../types';
import {
  generateContent,
  storeContent,
  buildCacheKey,
  getContent,
  isContentFresh,
} from '../utils/claude';
import {
  fetchIndustryNews,
  cacheNews,
  getCachedNews,
} from '../utils/news';
import { isConfiguredSecret } from '../utils/config';

// Cache for industry news to avoid fetching same news multiple times
const newsCache: Map<string, NewsArticle[]> = new Map();

// Rate limiting - Claude API limits
const DELAY_BETWEEN_REQUESTS = 500; // 500ms between API calls
const DEFAULT_MAX_GENERATIONS_PER_RUN = 100; // Limit per run to avoid timeouts/cost
const DEFAULT_CONTENT_MAX_AGE_DAYS = 3; // Refresh cadence (set to 1 for daily refresh)
const DEFAULT_MAX_WALLTIME_MS = 240_000; // Default wall clock budget per run (override via env/MAX_WALLTIME_MS)
const DEFAULT_COMBO_GENERATION_LIMIT = 200; // Default number of combo pages to include in the task list (align with sitemap coverage)

type GenerationRunSummary = {
  startedAt: string;
  endedAt: string;
  cron: string;
  cursorStart: number;
  cursorEnd: number;
  scannedTasks: number;
  totalTasks: number;
  maxGenerationsPerRun: number;
  contentMaxAgeDays: number;
  maxWallTimeMs: number;
  successCount: number;
  skippedCount: number;
  errorCount: number;
  attemptedGenerations: number;
  stoppedReason: 'completed' | 'max_generations' | 'max_walltime' | 'misconfigured';
};

function parsePositiveInt(value: string | undefined, fallback: number): number {
  if (!value) return fallback;
  const n = Number.parseInt(value, 10);
  return Number.isFinite(n) && n > 0 ? n : fallback;
}

async function readCursor(env: Bindings): Promise<number> {
  try {
    const raw = await env.SEO_CACHE.get('cron:cursor');
    if (!raw) return 0;
    const n = Number.parseInt(raw, 10);
    return Number.isFinite(n) && n >= 0 ? n : 0;
  } catch {
    return 0;
  }
}

async function writeCursor(env: Bindings, cursor: number): Promise<void> {
  try {
    await env.SEO_CACHE.put('cron:cursor', String(cursor));
  } catch {
    // ignore
  }
}

async function writeLastRun(env: Bindings, summary: GenerationRunSummary): Promise<void> {
  try {
    await env.SEO_CACHE.put('cron:last-run', JSON.stringify(summary), { expirationTtl: 86400 * 7 });
  } catch {
    // ignore
  }
}

/**
 * Main scheduled handler
 */
export async function scheduledHandler(
  event: ScheduledEvent,
  env: Bindings,
  ctx: ExecutionContext
): Promise<void> {
  const maxGenerationsPerRun = parsePositiveInt(env.MAX_GENERATIONS_PER_RUN, DEFAULT_MAX_GENERATIONS_PER_RUN);
  const contentMaxAgeDays = parsePositiveInt(env.CONTENT_MAX_AGE_DAYS, DEFAULT_CONTENT_MAX_AGE_DAYS);
  const maxWallTimeMs = parsePositiveInt(env.MAX_WALLTIME_MS, DEFAULT_MAX_WALLTIME_MS);

  await runContentGeneration(event, env, ctx, {
    maxGenerationsPerRun,
    contentMaxAgeDays,
    maxWallTimeMs,
  });
}

export async function runContentGeneration(
  event: ScheduledEvent,
  env: Bindings,
  ctx: ExecutionContext,
  options?: {
    maxGenerationsPerRun?: number;
    contentMaxAgeDays?: number;
    maxWallTimeMs?: number;
  }
): Promise<GenerationRunSummary> {
  const startedAtMs = Date.now();
  const startedAt = new Date(startedAtMs).toISOString();
  const cron = event?.cron || 'unknown';

  const maxGenerationsPerRun = options?.maxGenerationsPerRun ?? parsePositiveInt(env.MAX_GENERATIONS_PER_RUN, DEFAULT_MAX_GENERATIONS_PER_RUN);
  const contentMaxAgeDays = options?.contentMaxAgeDays ?? parsePositiveInt(env.CONTENT_MAX_AGE_DAYS, DEFAULT_CONTENT_MAX_AGE_DAYS);
  const maxWallTimeMs = options?.maxWallTimeMs ?? parsePositiveInt(env.MAX_WALLTIME_MS, DEFAULT_MAX_WALLTIME_MS);

  console.log(`[Scheduled] Starting content generation at ${startedAt} (cron=${cron})`);

  if (!isConfiguredSecret(env.SEO_WORKER_SECRET)) {
    console.error('[Scheduled] SEO_WORKER_SECRET not configured (or still set to a placeholder)');
    const summary: GenerationRunSummary = {
      startedAt,
      endedAt: new Date().toISOString(),
      cron,
      cursorStart: 0,
      cursorEnd: 0,
      scannedTasks: 0,
      totalTasks: 0,
      maxGenerationsPerRun,
      contentMaxAgeDays,
      maxWallTimeMs,
      successCount: 0,
      skippedCount: 0,
      errorCount: 0,
      attemptedGenerations: 0,
      stoppedReason: 'misconfigured',
    };
    await writeLastRun(env, summary);
    return summary;
  }

  const tasks: ContentRequest[] = [];

  // Priority 1: All industry pages
  const industrySlugs = getIndustrySlugs();
  for (const slug of industrySlugs) {
    const industry = INDUSTRIES[slug];
    tasks.push({
      type: 'industry',
      industry: {
        name: industry.name,
        namePlural: industry.namePlural,
        slug: industry.slug,
      },
    });
  }

  // Priority 2: All location pages (34 cities - Ireland, UK, USA)
  const allCities = getAllCities();
  for (const city of allCities) {
    tasks.push({
      type: 'location',
      location: { city: city.name, country: city.country },
    });
  }

  // Priority 3: Industry + location combos (default: first 200 combos by deterministic ordering)
  // This is intentionally aligned with sitemap coverage so the URLs we surface get unique AI content.
  const comboLimit = parsePositiveInt(env.COMBO_GENERATION_LIMIT, DEFAULT_COMBO_GENERATION_LIMIT);
  const maxComboTasks = Math.min(comboLimit, industrySlugs.length * allCities.length);

  let comboCount = 0;
  for (const industrySlug of industrySlugs) {
    const industry = INDUSTRIES[industrySlug];
    for (const city of allCities) {
      if (comboCount >= maxComboTasks) break;
      tasks.push({
        type: 'industry-location',
        industry: {
          name: industry.name,
          namePlural: industry.namePlural,
          slug: industry.slug,
        },
        location: { city: city.name, country: city.country },
      });
      comboCount++;
    }
    if (comboCount >= maxComboTasks) break;
  }

  const totalTasks = tasks.length;
  const cursorStart = totalTasks > 0 ? (await readCursor(env)) % totalTasks : 0;

  const rotatedTasks =
    cursorStart > 0 ? tasks.slice(cursorStart).concat(tasks.slice(0, cursorStart)) : tasks;

  console.log(
    `[Scheduled] Scanning ${rotatedTasks.length} tasks (cursorStart=${cursorStart}, maxGenerationsPerRun=${maxGenerationsPerRun}, contentMaxAgeDays=${contentMaxAgeDays}, maxWallTimeMs=${maxWallTimeMs})`
  );

  let successCount = 0;
  let errorCount = 0;
  let skippedCount = 0;
  let scannedTasks = 0;
  let attemptedGenerations = 0;
  let stoppedReason: GenerationRunSummary['stoppedReason'] = 'completed';

  for (const task of rotatedTasks) {
    scannedTasks++;

    if (Date.now() - startedAtMs > maxWallTimeMs) {
      stoppedReason = 'max_walltime';
      break;
    }

    if (attemptedGenerations >= maxGenerationsPerRun) {
      stoppedReason = 'max_generations';
      break;
    }

    const cacheKey = buildCacheKey(task);

    try {
      // Check if content exists and is recent
      const existing = await getContent(env.CONTENT_CACHE, cacheKey);
      if (existing && isContentFresh(existing, contentMaxAgeDays)) {
        console.log(`[Scheduled] Skipping ${cacheKey} - content is fresh`);
        skippedCount++;
        continue;
      }

      attemptedGenerations++;

      // Fetch industry news if applicable
      let newsArticles: NewsArticle[] = [];
      if (task.industry) {
        newsArticles = await getIndustryNewsWithCache(task.industry.name, env);
        if (newsArticles.length > 0) {
          console.log(`[Scheduled] Found ${newsArticles.length} news articles for ${task.industry.name}`);
        }
      }

      // Add news to task for content generation
      const taskWithNews: ContentRequest = {
        ...task,
        newsArticles,
      };

      // Generate fresh content with news context
      console.log(`[Scheduled] Generating content for ${cacheKey}`);
      const content = await generateContent(
        env.SEO_WORKER_SECRET,
        taskWithNews,
        env.API_URL
      );

      // Validate content structure
      if (!content.title || !content.metaDescription) {
        throw new Error('Generated content missing required fields');
      }

      // Store in KV
      await storeContent(env.CONTENT_CACHE, cacheKey, content);
      successCount++;

      console.log(`[Scheduled] Stored ${cacheKey}`);

      // Rate limiting delay
      await delay(DELAY_BETWEEN_REQUESTS);
    } catch (error) {
      errorCount++;
      console.error(`[Scheduled] Error generating ${cacheKey}:`, error);

      // Continue with next task even if one fails
      await delay(DELAY_BETWEEN_REQUESTS);
    }
  }

  console.log(
    `[Scheduled] Completed: ${successCount} success, ${skippedCount} skipped, ${errorCount} errors`
  );

  const cursorEnd = totalTasks > 0 ? (cursorStart + scannedTasks) % totalTasks : 0;
  await writeCursor(env, cursorEnd);

  const summary: GenerationRunSummary = {
    startedAt,
    endedAt: new Date().toISOString(),
    cron,
    cursorStart,
    cursorEnd,
    scannedTasks,
    totalTasks,
    maxGenerationsPerRun,
    contentMaxAgeDays,
    maxWallTimeMs,
    successCount,
    skippedCount,
    errorCount,
    attemptedGenerations,
    stoppedReason,
  };

  await writeLastRun(env, summary);
  return summary;
}

/**
 * Manual content generation for single item
 */
export async function manualGenerateContent(
  env: Bindings,
  request: ContentRequest
): Promise<{ success: boolean; cacheKey: string; error?: string }> {
  if (!isConfiguredSecret(env.SEO_WORKER_SECRET)) {
    return { success: false, cacheKey: '', error: 'SEO_WORKER_SECRET not configured (or still set to a placeholder)' };
  }

  const cacheKey = buildCacheKey(request);

  try {
    // Fetch industry news if applicable
    let newsArticles: NewsArticle[] = [];
    if (request.industry) {
      newsArticles = await getIndustryNewsWithCache(request.industry.name, env);
    }

    const requestWithNews: ContentRequest = {
      ...request,
      newsArticles,
    };

    const content = await generateContent(
      env.SEO_WORKER_SECRET,
      requestWithNews,
      env.API_URL
    );

    await storeContent(env.CONTENT_CACHE, cacheKey, content);

    return { success: true, cacheKey };
  } catch (error) {
    return {
      success: false,
      cacheKey,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Utility: Delay function
 */
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Fetch industry news with in-memory and KV caching
 * This prevents fetching the same news multiple times during a single run
 */
async function getIndustryNewsWithCache(
  industryName: string,
  env: Bindings
): Promise<NewsArticle[]> {
  // Check in-memory cache first (for same run)
  const cacheKeyMem = industryName.toLowerCase();
  if (newsCache.has(cacheKeyMem)) {
    return newsCache.get(cacheKeyMem) || [];
  }

  // Check KV cache (persisted, 6 hour TTL)
  try {
    const cached = await getCachedNews(env.SEO_CACHE, industryName);
    if (cached && cached.articles.length > 0) {
      // Store in memory cache for this run
      newsCache.set(cacheKeyMem, cached.articles);
      return cached.articles;
    }
  } catch (e) {
    console.error(`[News] Error reading KV cache for ${industryName}:`, e);
  }

  // Fetch fresh news from Google News RSS
  try {
    const articles = await fetchIndustryNews(industryName, 5);

    if (articles.length > 0) {
      // Store in both caches
      newsCache.set(cacheKeyMem, articles);
      await cacheNews(env.SEO_CACHE, industryName, articles);
    }

    return articles;
  } catch (e) {
    console.error(`[News] Error fetching news for ${industryName}:`, e);
    return [];
  }
}
