import { MetadataRoute } from 'next';
import { INTEGRATIONS } from '@/lib/marketing/integrations';
import { getReceptionistCitySlugs } from '@/lib/content/receptionist-cities';

const BASE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://voicefleet.ai').replace(/\/+$/, '');

/**
 * Get API URL at request time (not module load time)
 */
function getApiUrl(): string | undefined {
  return process.env.API_URL || process.env.NEXT_PUBLIC_API_URL;
}

interface ContentItem {
  slug: string;
  updated_at: string;
}

interface ComboItem {
  industry_slug: string;
  location_slug: string;
  updated_at: string;
}

interface SitemapData {
  blogPosts: ContentItem[];
  useCases: ContentItem[];
  locations: ContentItem[];
  features: ContentItem[];
  combos: ComboItem[];
  comparisons: ContentItem[];
}

async function fetchSitemapData(): Promise<SitemapData | null> {
  const apiUrl = getApiUrl();
  if (!apiUrl) {
    console.warn('[sitemap] API_URL not configured');
    return null;
  }
  try {
    const response = await fetch(
      `${apiUrl}/api/content/sitemap-data`,
      { cache: 'no-store' }
    );

    if (!response.ok) {
      return null;
    }

    return response.json();
  } catch {
    // Return null if API is not available yet
    return null;
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const content = await fetchSitemapData();

  // Static pages - always included
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${BASE_URL}/pricing`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/login`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/register`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/terms`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/for`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/in`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/features`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/connect`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    ...INTEGRATIONS.map((integration) => ({
      url: `${BASE_URL}/connect/${integration.slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
    {
      url: `${BASE_URL}/compare`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    // Spanish pages
    {
      url: `${BASE_URL}/es`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/es/precios`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/es/funciones`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    // City landing pages
    ...getReceptionistCitySlugs().map((slug) => ({
      url: `${BASE_URL}/ai-receptionist/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ];

  // If no dynamic content yet, return only static pages
  if (!content) {
    return staticPages;
  }

  /** Strip leading slashes from a slug to prevent double-slash URLs */
  const s = (slug: string) => slug.replace(/^\/+/, '');

  // Dynamic blog posts
  const blogPosts: MetadataRoute.Sitemap = content.blogPosts.map((post) => ({
    url: `${BASE_URL}/blog/${s(post.slug)}`,
    lastModified: new Date(post.updated_at),
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  // Dynamic use case pages
  const useCases: MetadataRoute.Sitemap = content.useCases.map((page) => ({
    url: `${BASE_URL}/for/${s(page.slug)}`,
    lastModified: new Date(page.updated_at),
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  // Dynamic location pages
  const locations: MetadataRoute.Sitemap = content.locations.map((page) => ({
    url: `${BASE_URL}/in/${s(page.slug)}`,
    lastModified: new Date(page.updated_at),
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  // Dynamic feature pages
  const features: MetadataRoute.Sitemap = content.features.map((page) => ({
    url: `${BASE_URL}/features/${s(page.slug)}`,
    lastModified: new Date(page.updated_at),
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  // Dynamic combo pages (industry + location)
  const combos: MetadataRoute.Sitemap = (content.combos || []).map((page) => ({
    url: `${BASE_URL}/${s(page.industry_slug)}/${s(page.location_slug)}`,
    lastModified: new Date(page.updated_at),
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  // Dynamic comparison pages
  const comparisons: MetadataRoute.Sitemap = (content.comparisons || []).map((page) => ({
    url: `${BASE_URL}/compare/${s(page.slug)}`,
    lastModified: new Date(page.updated_at),
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  return [...staticPages, ...blogPosts, ...useCases, ...locations, ...features, ...combos, ...comparisons];
}
