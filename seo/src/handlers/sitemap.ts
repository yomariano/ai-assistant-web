/**
 * VoiceFleet SEO - Sitemap Handlers
 * Generates XML sitemaps for all SEO pages + blog, comparisons, and static pages
 */

import { Context } from 'hono';
import { Bindings } from '../types';
import { INDUSTRIES, getIndustrySlugs } from '../data/industries';
import { COUNTRIES, getAllCities } from '../data/locations';

interface ContentItem {
  slug: string;
  updated_at: string;
  language?: string;
}

interface SitemapApiData {
  blogPosts: ContentItem[];
  comparisons: ContentItem[];
}

/** Strip trailing slashes from a URL base and leading slashes from a slug */
function normalizeUrl(base: string, path: string): string {
  return `${base.replace(/\/+$/, '')}/${path.replace(/^\/+/, '')}`;
}

async function fetchSitemapApiData(apiUrl: string): Promise<SitemapApiData | null> {
  try {
    const response = await fetch(`${apiUrl.replace(/\/+$/, '')}/api/content/sitemap-data`, {
      headers: { 'Accept': 'application/json' },
    });
    if (!response.ok) return null;
    return response.json();
  } catch {
    return null;
  }
}

/**
 * Sitemap index handler - lists all sub-sitemaps
 */
export async function sitemapIndexHandler(c: Context<{ Bindings: Bindings }>) {
  const siteUrl = (c.env.SITE_URL || 'https://voicefleet.ai').replace(/\/+$/, '');

  const sitemaps = [
    'static',
    'blog',
    'comparisons',
    'indexes',
    'industries',
    'locations-ireland',
    'locations-uk',
    'locations-usa',
    'industry-locations-1',
    'industry-locations-2',
    'locations-argentina',
    'ai-receptionist'
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemaps.map(s => `  <sitemap>
    <loc>${siteUrl}/sitemaps/${s}.xml</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
  </sitemap>`).join('\n')}
</sitemapindex>`;

  return c.text(xml, 200, {
    'Content-Type': 'application/xml',
    'Cache-Control': 'max-age=3600'
  });
}

/**
 * Individual sitemap handler
 */
export async function sitemapHandler(c: Context<{ Bindings: Bindings }>) {
  const type = c.req.param('type');
  const siteUrl = (c.env.SITE_URL || 'https://voicefleet.ai').replace(/\/+$/, '');

  let urls: Array<{ loc: string; priority: string; changefreq: string }> = [];

  switch (type) {
    case 'indexes':
      urls = generateIndexesSitemap(siteUrl);
      break;
    case 'industries':
      urls = generateIndustriesSitemap(siteUrl);
      break;
    case 'locations-ireland':
      urls = generateLocationsSitemap(siteUrl, 'ireland');
      break;
    case 'locations-uk':
      urls = generateLocationsSitemap(siteUrl, 'uk');
      break;
    case 'locations-usa':
      urls = generateLocationsSitemap(siteUrl, 'usa');
      break;
    case 'locations-argentina':
      urls = generateLocationsSitemap(siteUrl, 'argentina');
      break;
    case 'industry-locations-1':
      urls = generateIndustryLocationsSitemap(siteUrl, 0, 100);
      break;
    case 'industry-locations-2':
      urls = generateIndustryLocationsSitemap(siteUrl, 100, 200);
      break;
    case 'ai-receptionist':
      urls = generateAiReceptionistSitemap(siteUrl);
      break;
    default:
      return c.notFound();
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url>
    <loc>${u.loc}</loc>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  return c.text(xml, 200, {
    'Content-Type': 'application/xml',
    'Cache-Control': 'max-age=3600'
  });
}

export async function sitemapHandlerWithType(
  c: Context<{ Bindings: Bindings }>,
  type: string
) {
  const siteUrl = (c.env.SITE_URL || 'https://voicefleet.ai').replace(/\/+$/, '');
  const apiUrl = (c.env.API_URL || 'https://api.voicefleet.ai').replace(/\/+$/, '');

  let urls: Array<{ loc: string; priority: string; changefreq: string; lastmod?: string }> = [];

  switch (type) {
    case 'static':
      urls = generateStaticSitemap(siteUrl);
      break;
    case 'blog':
      urls = await generateBlogSitemap(siteUrl, apiUrl);
      break;
    case 'comparisons':
      urls = await generateComparisonsSitemap(siteUrl, apiUrl);
      break;
    case 'indexes':
      urls = generateIndexesSitemap(siteUrl);
      break;
    case 'industries':
      urls = generateIndustriesSitemap(siteUrl);
      break;
    case 'locations-ireland':
      urls = generateLocationsSitemap(siteUrl, 'ireland');
      break;
    case 'locations-uk':
      urls = generateLocationsSitemap(siteUrl, 'uk');
      break;
    case 'locations-usa':
      urls = generateLocationsSitemap(siteUrl, 'usa');
      break;
    case 'locations-argentina':
      urls = generateLocationsSitemap(siteUrl, 'argentina');
      break;
    case 'industry-locations-1':
      urls = generateIndustryLocationsSitemap(siteUrl, 0, 100);
      break;
    case 'industry-locations-2':
      urls = generateIndustryLocationsSitemap(siteUrl, 100, 200);
      break;
    case 'ai-receptionist':
      urls = generateAiReceptionistSitemap(siteUrl);
      break;
    default:
      return c.notFound();
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url>
    <loc>${u.loc}</loc>${u.lastmod ? `\n    <lastmod>${u.lastmod}</lastmod>` : ''}
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  return c.text(xml, 200, {
    'Content-Type': 'application/xml',
    'Cache-Control': 'max-age=3600'
  });
}

/**
 * Generate industries sitemap URLs
 */
function generateIndustriesSitemap(siteUrl: string) {
  const urls = [
    // Industries index
    { loc: `${siteUrl}/industries`, priority: '0.9', changefreq: 'weekly' }
  ];

  // Individual industry pages
  for (const slug of getIndustrySlugs()) {
    urls.push({
      loc: `${siteUrl}/industries/${slug}`,
      priority: '0.8',
      changefreq: 'weekly'
    });
  }

  return urls;
}

/**
 * Generate core index pages sitemap URLs
 */
function generateIndexesSitemap(siteUrl: string) {
  return [
    { loc: `${siteUrl}/industries`, priority: '0.9', changefreq: 'weekly' },
    { loc: `${siteUrl}/locations`, priority: '0.9', changefreq: 'weekly' },
    { loc: `${siteUrl}/locations/ireland`, priority: '0.7', changefreq: 'weekly' },
    { loc: `${siteUrl}/locations/uk`, priority: '0.7', changefreq: 'weekly' },
    { loc: `${siteUrl}/locations/usa`, priority: '0.7', changefreq: 'weekly' }
  ];
}

/**
 * Generate locations sitemap URLs for a country
 */
function generateLocationsSitemap(siteUrl: string, countrySlug: string) {
  const urls: Array<{ loc: string; priority: string; changefreq: string }> = [];
  const country = COUNTRIES[countrySlug];

  if (!country) return urls;

  // Individual city pages
  for (const city of country.cities) {
    urls.push({
      loc: `${siteUrl}/locations/${countrySlug}/${city.slug}`,
      priority: '0.7',
      changefreq: 'weekly'
    });
  }

  return urls;
}

/**
 * Generate industry + location combo sitemap URLs
 */
function generateIndustryLocationsSitemap(siteUrl: string, offset: number, limit: number) {
  const urls: Array<{ loc: string; priority: string; changefreq: string }> = [];
  const industries = Object.values(INDUSTRIES);
  const cities = getAllCities();

  let count = 0;
  for (const industry of industries) {
    for (const city of cities) {
      if (count >= offset && count < offset + limit) {
        urls.push({
          loc: `${siteUrl}/${industry.slug}-voice-agent-in-${city.slug}`,
          priority: '0.6',
          changefreq: 'weekly'
        });
      }
      count++;
      if (count >= offset + limit) break;
    }
    if (count >= offset + limit) break;
  }

  return urls;
}

/**
 * Generate static pages sitemap (homepage, features, blog listing, etc.)
 */
function generateStaticSitemap(siteUrl: string) {
  return [
    { loc: siteUrl, priority: '1.0', changefreq: 'weekly' },
    { loc: `${siteUrl}/features`, priority: '0.8', changefreq: 'weekly' },
    { loc: `${siteUrl}/blog`, priority: '0.8', changefreq: 'daily' },
    { loc: `${siteUrl}/compare`, priority: '0.7', changefreq: 'weekly' },
    { loc: `${siteUrl}/connect`, priority: '0.7', changefreq: 'weekly' },
    { loc: `${siteUrl}/privacy`, priority: '0.3', changefreq: 'yearly' },
    { loc: `${siteUrl}/terms`, priority: '0.3', changefreq: 'yearly' },
  ];
}

/**
 * Generate blog posts sitemap (fetched from API)
 */
async function generateBlogSitemap(siteUrl: string, apiUrl: string) {
  const data = await fetchSitemapApiData(apiUrl);
  if (!data?.blogPosts?.length) return [];

  return data.blogPosts
    .filter(post => {
      // Skip posts with malformed slugs (leading slashes, path prefixes)
      const clean = post.slug.replace(/^\/+/, '');
      return clean && !clean.includes('/');
    })
    .map(post => {
      const slug = post.slug.replace(/^\/+/, '').replace(/\/+$/, '');
      const prefix = post.language === 'es' ? 'es/blog' : 'blog';
      return {
        loc: normalizeUrl(siteUrl, `${prefix}/${slug}`),
        lastmod: post.updated_at ? new Date(post.updated_at).toISOString().split('T')[0] : undefined,
        priority: '0.7',
        changefreq: 'weekly',
      };
    });
}

/**
 * Generate comparison pages sitemap (fetched from API)
 */
async function generateComparisonsSitemap(siteUrl: string, apiUrl: string) {
  const data = await fetchSitemapApiData(apiUrl);
  if (!data?.comparisons?.length) return [];

  return data.comparisons.map(page => ({
    loc: normalizeUrl(siteUrl, `compare/${page.slug.replace(/^\/+/, '')}`),
    lastmod: page.updated_at ? new Date(page.updated_at).toISOString().split('T')[0] : undefined,
    priority: '0.6',
    changefreq: 'monthly',
  }));
}

/**
 * Generate AI Receptionist pages sitemap (EN + ES)
 */
function generateAiReceptionistSitemap(siteUrl: string) {
  const urls: Array<{ loc: string; priority: string; changefreq: string }> = [];

  // EN industry short slugs → canonical slugs
  const enMap: Record<string, string> = {
    'dental': 'dental-clinics',
    'restaurant': 'restaurants',
  };
  // ES industry short slugs → canonical slugs
  const esMap: Record<string, string> = {
    'odontologos': 'dental-clinics',
    'restaurantes': 'restaurants',
  };

  const allCities = getAllCities();

  // EN pages: /ai-receptionist-{shortIndustry}-{city}
  for (const [shortKey] of Object.entries(enMap)) {
    for (const city of allCities) {
      urls.push({
        loc: `${siteUrl}/ai-receptionist-${shortKey}-${city.slug}`,
        priority: '0.6',
        changefreq: 'weekly'
      });
    }
  }

  // ES pages: /es/asistente-ia-{shortIndustry}-{city} (Argentina cities only)
  const arCities = COUNTRIES['argentina']?.cities || [];
  for (const [shortKey] of Object.entries(esMap)) {
    for (const city of arCities) {
      urls.push({
        loc: `${siteUrl}/es/asistente-ia-${shortKey}-${city.slug}`,
        priority: '0.6',
        changefreq: 'weekly'
      });
    }
  }

  return urls;
}
