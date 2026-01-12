/**
 * VoiceFleet SEO - Scheduled Content Generation Handler
 * Runs daily at 2am UTC to generate fresh AI content for SEO pages
 * Enhanced with Google News RSS for current industry trends
 */

import { INDUSTRIES, getIndustrySlugs } from '../data/industries';
import { COUNTRIES, getAllCities } from '../data/locations';
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

// Cache for industry news to avoid fetching same news multiple times
const newsCache: Map<string, NewsArticle[]> = new Map();

// Rate limiting - Claude API limits
const DELAY_BETWEEN_REQUESTS = 500; // 500ms between API calls
const MAX_REQUESTS_PER_RUN = 100; // Limit per cron run to avoid timeouts

/**
 * Main scheduled handler
 */
export async function scheduledHandler(
  event: ScheduledEvent,
  env: Bindings,
  ctx: ExecutionContext
): Promise<void> {
  console.log(`[Scheduled] Starting content generation at ${new Date().toISOString()}`);

  if (!env.SEO_WORKER_SECRET) {
    console.error('[Scheduled] SEO_WORKER_SECRET not configured');
    return;
  }

  const tasks: ContentRequest[] = [];

  // Priority 1: All industry pages (18 items)
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

  // Priority 2: Top locations (34 items - Ireland, UK, US)
  const topCities: Array<{ city: string; country: string; slug: string }> = [];
  for (const countrySlug of ['ireland', 'uk', 'usa']) {
    const country = COUNTRIES[countrySlug];
    if (country) {
      for (const city of country.cities.slice(0, 12)) {
        topCities.push({
          city: city.name,
          country: country.name,
          slug: city.slug,
        });
      }
    }
  }

  for (const loc of topCities) {
    tasks.push({
      type: 'location',
      location: { city: loc.city, country: loc.country },
    });
  }

  // Priority 3: Top industry + location combos (60 items)
  const topIndustries = industrySlugs.slice(0, 10);
  for (const industrySlug of topIndustries) {
    const industry = INDUSTRIES[industrySlug];
    for (const loc of topCities.slice(0, 6)) {
      tasks.push({
        type: 'industry-location',
        industry: {
          name: industry.name,
          namePlural: industry.namePlural,
          slug: industry.slug,
        },
        location: { city: loc.city, country: loc.country },
      });
    }
  }

  // Limit tasks to avoid timeout
  const tasksToProcess = tasks.slice(0, MAX_REQUESTS_PER_RUN);

  console.log(
    `[Scheduled] Processing ${tasksToProcess.length} of ${tasks.length} total tasks`
  );

  let successCount = 0;
  let errorCount = 0;
  let skippedCount = 0;

  for (const task of tasksToProcess) {
    const cacheKey = buildCacheKey(task);

    try {
      // Check if content exists and is recent (less than 3 days old)
      const existing = await getContent(env.CONTENT_CACHE, cacheKey);
      if (existing && isContentFresh(existing, 3)) {
        console.log(`[Scheduled] Skipping ${cacheKey} - content is fresh`);
        skippedCount++;
        continue;
      }

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
}

/**
 * Manual content generation for single item
 */
export async function manualGenerateContent(
  env: Bindings,
  request: ContentRequest
): Promise<{ success: boolean; cacheKey: string; error?: string }> {
  if (!env.SEO_WORKER_SECRET) {
    return { success: false, cacheKey: '', error: 'SEO_WORKER_SECRET not configured' };
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
