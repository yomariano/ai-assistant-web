/**
 * VoiceFleet Programmatic SEO - Cloudflare Worker
 * Generates optimized landing pages for AI voice agent services
 */

import { Hono, type Context } from 'hono';
import { cache } from 'hono/cache';
import { locationHandler } from './handlers/location';
import { locationsCountryHandler, locationsIndexHandler } from './handlers/locations-index';
import { industryLocationHandler } from './handlers/industry-location';
import { aiReceptionistHandler, asistenteIaHandler } from './handlers/ai-receptionist';
import { sitemapHandlerWithType, sitemapIndexHandler } from './handlers/sitemap';
import { robotsHandler } from './handlers/robots';
import { scheduledHandler, manualGenerateContent, runContentGeneration } from './handlers/scheduled';
import { INDUSTRIES, getIndustry } from './data/industries';
import { COUNTRIES } from './data/locations';
import { Bindings } from './types';
import { isConfiguredSecret } from './utils/config';

const app = new Hono<{ Bindings: Bindings }>();

function isAdminAuthorized(c: Context<{ Bindings: Bindings }>, secretFromBody?: string) {
  const adminSecret = isConfiguredSecret(c.env.ADMIN_SECRET) ? c.env.ADMIN_SECRET.trim() : null;
  if (!adminSecret) return false;
  const secretFromHeader = c.req.header('x-admin-secret');
  const secretFromQuery = c.req.query('secret');
  return secretFromHeader === adminSecret || secretFromQuery === adminSecret || secretFromBody === adminSecret;
}

// Detect whether a path matches a known SEO route (served entirely by this worker).
// Non-SEO paths are passed through to origin and must NOT be cached here.
function isSEORoute(path: string): boolean {
  return (
    path === '/health' ||
    path === '/robots.txt' ||
    path === '/sitemap.xml' ||
    path.startsWith('/sitemaps/') ||
    path.startsWith('/industries') ||
    path.startsWith('/locations') ||
    path.startsWith('/es/asistente-ia-') ||
    path.startsWith('/ai-receptionist-') ||
    /-.+-voice-agent-in-.+/.test(path)
  );
}

// Cache middleware - only for GET requests on SEO routes
app.use('*', async (c, next) => {
  // Skip caching for admin routes, non-GET requests, and non-SEO routes (pass-through)
  if (c.req.path.startsWith('/admin') || c.req.method !== 'GET' || !isSEORoute(c.req.path)) {
    return next();
  }

  // Apply cache for GET requests on SEO routes only
  const cacheMiddleware = cache({
    cacheName: 'voicefleet-seo-v5',
    cacheControl: 'max-age=3600, stale-while-revalidate=86400',
  });
  return cacheMiddleware(c, next);
});

// Health check
app.get('/health', (c) => c.json({ status: 'ok', service: 'voicefleet-seo' }));

// Robots.txt
app.get('/robots.txt', robotsHandler);

// Sitemap routes
app.get('/sitemap.xml', sitemapIndexHandler);
app.get('/sitemaps/:type', (c) => {
  // Extract type param and remove .xml if present
  let type = c.req.param('type');
  if (type.endsWith('.xml')) {
    type = type.slice(0, -4);
  }
  return sitemapHandlerWithType(c, type);
});

// Legacy industry pages now redirect to the canonical Next.js use-case pages.
app.get('/industries', (c) => {
  const siteUrl = (c.env.SITE_URL || 'https://voicefleet.ai').replace(/\/+$/, '');
  return c.redirect(`${siteUrl}/for`, 301);
});

app.get('/industries/:industry', (c) => {
  const siteUrl = (c.env.SITE_URL || 'https://voicefleet.ai').replace(/\/+$/, '');
  const industry = getIndustry(c.req.param('industry'));

  if (!industry) {
    return c.notFound();
  }

  return c.redirect(`${siteUrl}/for/${industry.slug}`, 301);
});

// Location pages: /locations/ireland/dublin
app.get('/locations/:country/:city', locationHandler);

// Location index pages
app.get('/locations/:country', (c) => {
  const countrySlug = c.req.param('country');
  return locationsCountryHandler(c, countrySlug);
});

app.get('/locations', (c) => {
  return locationsIndexHandler(c);
});

// Spanish AI Receptionist pages: /es/asistente-ia-odontologos-buenos-aires
// Must be before the single-segment catch-all since /es/... is multi-segment
app.get('/es/:slug', async (c) => {
  const slug = c.req.param('slug');
  if (slug.startsWith('asistente-ia-')) {
    const remainder = slug.replace(/^asistente-ia-/, '');
    if (remainder) return asistenteIaHandler(c, remainder);
  }
  return c.notFound();
});

// Industry + Location pages AND AI Receptionist pages (single path segment)
app.get('/:industryLocation', async (c) => {
  const slug = c.req.param('industryLocation');

  // Check if it matches AI Receptionist pattern: ai-receptionist-{industry}-{city}
  if (slug.startsWith('ai-receptionist-')) {
    const remainder = slug.replace(/^ai-receptionist-/, '');
    if (remainder) return aiReceptionistHandler(c, remainder);
  }

  // Check if it matches the pattern: {industry}-voice-agent-in-{location}
  const match = slug.match(/^(.+)-voice-agent-in-(.+)$/);
  if (match) {
    const [, industry, location] = match;
    return industryLocationHandler(c, industry, location);
  }

  // Not a match - return 404
  return c.notFound();
});

// Pass-through handler for non-SEO routes.
// Adds X-Country-Code header from Cloudflare's geo data so the Next.js
// middleware can gate access by country (cf-ipcountry may be stripped by Traefik).
app.notFound(async (c) => {
  const cf = (c.req.raw as any).cf as { country?: string } | undefined;
  const country = cf?.country || '';

  const originRequest = new Request(c.req.url, c.req.raw);
  originRequest.headers.set('X-Country-Code', country);

  return fetch(originRequest);
});

// Error handler
app.onError((err, c) => {
  console.error('Error:', err);
  return c.html(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Error | VoiceFleet</title>
      <meta name="robots" content="noindex">
      <style>
        body { font-family: system-ui; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; }
        .container { text-align: center; }
        h1 { color: #ef4444; }
        a { color: #3b82f6; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Something went wrong</h1>
        <p>We're working on fixing this.</p>
        <a href="/">Go to VoiceFleet</a>
      </div>
    </body>
    </html>
  `, 500);
});

// Admin endpoint for manual content generation
app.post('/admin/generate', async (c) => {
  const body = await c.req.json().catch(() => ({})) as {
    type?: string;
    industry?: string;
    location?: string;
    secret?: string;
  };

  // Simple secret check
  if (!isAdminAuthorized(c, body.secret)) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  let request: Parameters<typeof manualGenerateContent>[1];

  if (body.type === 'industry' && body.industry) {
    const industry = INDUSTRIES[body.industry];
    if (!industry) {
      return c.json({ error: 'Industry not found' }, 404);
    }
    request = {
      type: 'industry',
      industry: { name: industry.name, namePlural: industry.namePlural, slug: industry.slug },
    };
  } else if (body.type === 'location' && body.location) {
    const [citySlug, countrySlug] = body.location.split(':');
    const country = COUNTRIES[countrySlug];
    const city = country?.cities.find((c) => c.slug === citySlug);
    if (!city || !country) {
      return c.json({ error: 'Location not found' }, 404);
    }
    request = {
      type: 'location',
      location: { city: city.name, country: country.name },
    };
  } else {
    return c.json({ error: 'Invalid request. Provide type (industry/location) and corresponding data' }, 400);
  }

  const result = await manualGenerateContent(c.env, request);
  return c.json(result);
});

// Cache status endpoint
app.get('/admin/cache-status', async (c) => {
  if (!isAdminAuthorized(c)) {
    return c.json({ error: 'Unauthorized' }, 401);
  }
  const keys = await c.env.CONTENT_CACHE.list({ limit: 100 });
  return c.json({
    totalKeys: keys.keys.length,
    keys: keys.keys.map((k) => ({
      name: k.name,
      expiration: k.expiration,
    })),
  });
});

// Last run summary (requires secret via header or query param)
app.get('/admin/run-status', async (c) => {
  if (!isAdminAuthorized(c)) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  const [cursorRaw, lastRunRaw] = await Promise.all([
    c.env.SEO_CACHE.get('cron:cursor'),
    c.env.SEO_CACHE.get('cron:last-run'),
  ]);

  return c.json({
    config: {
      adminSecretConfigured: isConfiguredSecret(c.env.ADMIN_SECRET),
      workerSecretConfigured: isConfiguredSecret(c.env.SEO_WORKER_SECRET),
      apiUrl: c.env.API_URL,
      siteUrl: c.env.SITE_URL,
    },
    cursor: cursorRaw ? Number.parseInt(cursorRaw, 10) : 0,
    lastRun: lastRunRaw ? JSON.parse(lastRunRaw) : null,
  });
});

// Bulk content generation endpoint
app.post('/admin/generate-all', async (c) => {
  const body = await c.req.json().catch(() => ({})) as {
    secret?: string;
    limit?: number;
    maxAgeDays?: number;
    maxWallTimeMs?: number;
    runSync?: boolean;
  };

  // Simple secret check
  if (!isAdminAuthorized(c, body.secret)) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  const maxGenerationsPerRun = typeof body.limit === 'number' && body.limit > 0 ? body.limit : undefined;
  const contentMaxAgeDays = typeof body.maxAgeDays === 'number' && body.maxAgeDays > 0 ? body.maxAgeDays : undefined;
  let maxWallTimeMs = typeof body.maxWallTimeMs === 'number' && body.maxWallTimeMs > 0 ? body.maxWallTimeMs : undefined;
  if (body.runSync && maxWallTimeMs === undefined) {
    maxWallTimeMs = 25_000;
  }

  const event = { scheduledTime: Date.now(), cron: 'manual', noRetry: true } as unknown as ScheduledEvent;

  if (body.runSync) {
    const summary = await runContentGeneration(event, c.env, c.executionCtx, {
      maxGenerationsPerRun,
      contentMaxAgeDays,
      maxWallTimeMs,
    });

    return c.json({ success: true, summary });
  }

  // Use waitUntil to run content generation in background
  c.executionCtx.waitUntil(
    runContentGeneration(event, c.env, c.executionCtx, {
      maxGenerationsPerRun,
      contentMaxAgeDays,
      maxWallTimeMs,
    })
  );

  return c.json({
    success: true,
    message: 'Content generation started in background. Use /admin/run-status to see the last run summary.',
  });
});

export default {
  fetch: app.fetch,
  scheduled: scheduledHandler,
};
