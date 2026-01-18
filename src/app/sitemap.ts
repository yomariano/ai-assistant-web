import { MetadataRoute } from 'next';
import { COMPARISONS } from '@/lib/marketing/comparisons';
import { INTEGRATIONS } from '@/lib/marketing/integrations';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://voicefleet.ai';
const API_URL = process.env.NEXT_PUBLIC_API_URL || process.env.API_URL;

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
}

async function fetchSitemapData(): Promise<SitemapData | null> {
  if (!API_URL) {
    return null;
  }
  try {
    const response = await fetch(
      `${API_URL}/api/content/sitemap-data`,
      { next: { revalidate: 3600 } } // Revalidate every hour
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
    ...COMPARISONS.map((comparison) => ({
      url: `${BASE_URL}/compare/${comparison.slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
  ];

  // If no dynamic content yet, return only static pages
  if (!content) {
    return staticPages;
  }

  // Dynamic blog posts
  const blogPosts: MetadataRoute.Sitemap = content.blogPosts.map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.updated_at),
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  // Dynamic use case pages
  const useCases: MetadataRoute.Sitemap = content.useCases.map((page) => ({
    url: `${BASE_URL}/for/${page.slug}`,
    lastModified: new Date(page.updated_at),
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  // Dynamic location pages
  const locations: MetadataRoute.Sitemap = content.locations.map((page) => ({
    url: `${BASE_URL}/in/${page.slug}`,
    lastModified: new Date(page.updated_at),
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  // Dynamic feature pages
  const features: MetadataRoute.Sitemap = content.features.map((page) => ({
    url: `${BASE_URL}/features/${page.slug}`,
    lastModified: new Date(page.updated_at),
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  // Dynamic combo pages (industry + location)
  const combos: MetadataRoute.Sitemap = (content.combos || []).map((page) => ({
    url: `${BASE_URL}/${page.industry_slug}/${page.location_slug}`,
    lastModified: new Date(page.updated_at),
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  return [...staticPages, ...blogPosts, ...useCases, ...locations, ...features, ...combos];
}
