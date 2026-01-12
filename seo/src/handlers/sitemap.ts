/**
 * VoiceFleet SEO - Sitemap Handlers
 * Generates XML sitemaps for all SEO pages
 */

import { Context } from 'hono';
import { Bindings } from '../types';
import { INDUSTRIES, getIndustrySlugs } from '../data/industries';
import { COUNTRIES, getAllCities } from '../data/locations';

/**
 * Sitemap index handler - lists all sub-sitemaps
 */
export async function sitemapIndexHandler(c: Context<{ Bindings: Bindings }>) {
  const siteUrl = c.env.SITE_URL || 'https://voicefleet.ai';

  const sitemaps = [
    'industries',
    'locations-ireland',
    'locations-uk',
    'locations-usa',
    'industry-locations-1',
    'industry-locations-2'
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
  const siteUrl = c.env.SITE_URL || 'https://voicefleet.ai';

  let urls: Array<{ loc: string; priority: string; changefreq: string }> = [];

  switch (type) {
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
    case 'industry-locations-1':
      urls = generateIndustryLocationsSitemap(siteUrl, 0, 100);
      break;
    case 'industry-locations-2':
      urls = generateIndustryLocationsSitemap(siteUrl, 100, 200);
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
