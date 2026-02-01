/**
 * Comparison Pages API Client
 * Fetches comparison pages from the backend API
 */

import type { ComparisonPage, ComparisonFaqItem } from "@/lib/marketing/comparisons";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * Rich content types
 */
export interface ChartConfig {
  id: string;
  type: 'bar' | 'line' | 'pie' | 'radar';
  title: string;
  data: Array<{ name: string; value: number; [key: string]: string | number }>;
  xAxisLabel?: string;
  yAxisLabel?: string;
  source?: string;
  sourceId?: number;
}

export interface Statistic {
  id?: string;
  value: string;
  label: string;
  context: string;
  sourceId?: number;
  highlight?: boolean;
}

export interface Source {
  id: number;
  title: string;
  url: string;
  author?: string;
  publishedDate?: string;
  accessedDate?: string;
  type?: 'report' | 'article' | 'study' | 'website';
}

export interface PricingData {
  voicefleet: {
    min: number;
    max: number;
    currency: string;
    period: string;
  };
  alternative: {
    min: number | null;
    max: number | null;
    currency: string;
    period: string;
    notes?: string;
    sourceId?: number;
  };
}

/**
 * API response type for comparison pages
 */
export interface ComparisonPageResponse {
  id: string;
  slug: string;
  alternative_name: string;
  alternative_slug: string;
  title: string;
  description: string;
  hero_title: string;
  hero_subtitle: string;
  who_this_is_for: string[];
  quick_take: { label: string; value: string }[];
  when_voicefleet_wins: string[];
  when_alternative_wins: string[];
  feature_comparison?: {
    feature: string;
    voicefleet: string;
    alternative: string;
    winner: string;
    sourceId?: number;
  }[];
  faq: ComparisonFaqItem[];
  detailed_comparison?: string;
  meta_title?: string;
  meta_description?: string;
  status: string;
  published_at?: string;
  created_at: string;
  updated_at: string;
  // Rich content fields
  chart_data?: ChartConfig[];
  statistics?: Statistic[];
  sources?: Source[];
  pricing_data?: PricingData;
}

/**
 * Transform API response to frontend ComparisonPage type
 */
function transformToComparisonPage(data: ComparisonPageResponse): ComparisonPage {
  return {
    slug: data.slug,
    title: data.title,
    description: data.description || "",
    heroTitle: data.hero_title,
    heroSubtitle: data.hero_subtitle,
    whoThisIsFor: data.who_this_is_for || [],
    quickTake: data.quick_take || [],
    whenVoiceFleetWins: data.when_voicefleet_wins || [],
    whenAlternativeWins: data.when_alternative_wins || [],
    faq: data.faq || [],
  };
}

/**
 * Fetch all published comparison pages
 * @returns Array of comparison pages for listing
 */
export async function getComparisonPages(): Promise<ComparisonPage[]> {
  if (!API_URL) {
    console.warn("[comparisons] NEXT_PUBLIC_API_URL not set");
    return [];
  }

  try {
    const res = await fetch(`${API_URL}/api/content/comparisons`, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (res.ok) {
      const data: ComparisonPageResponse[] = await res.json();
      return data.map(transformToComparisonPage);
    }

    console.error("[comparisons] Failed to fetch:", res.status);
    return [];
  } catch (error) {
    console.error("[comparisons] Error:", error);
    return [];
  }
}

/**
 * Fetch a single comparison page by slug
 * @param slug - Page slug (e.g., "voicefleet-vs-voicemail")
 * @returns Comparison page or null if not found
 */
export async function getComparisonPage(
  slug: string
): Promise<ComparisonPage | null> {
  if (!API_URL) {
    console.warn("[comparisons] NEXT_PUBLIC_API_URL not set");
    return null;
  }

  try {
    const res = await fetch(`${API_URL}/api/content/comparisons/${slug}`, {
      next: { revalidate: 3600 },
    });

    if (res.ok) {
      const data: ComparisonPageResponse = await res.json();
      return transformToComparisonPage(data);
    }

    if (res.status === 404) {
      return null;
    }

    console.error("[comparisons] Failed to fetch:", res.status);
    return null;
  } catch (error) {
    console.error("[comparisons] Error:", error);
    return null;
  }
}

/**
 * Fetch all comparison slugs for static generation
 * @returns Array of slugs
 */
export async function getComparisonSlugs(): Promise<string[]> {
  if (!API_URL) {
    console.warn("[comparisons] NEXT_PUBLIC_API_URL not set");
    return [];
  }

  try {
    const res = await fetch(`${API_URL}/api/content/comparisons`, {
      next: { revalidate: 3600 },
    });

    if (res.ok) {
      const data: ComparisonPageResponse[] = await res.json();
      return data.map((page) => page.slug);
    }

    console.error("[comparisons] Failed to fetch slugs:", res.status);
    return [];
  } catch (error) {
    console.error("[comparisons] Error fetching slugs:", error);
    return [];
  }
}

/**
 * Fetch the full API response (includes extra fields like feature_comparison)
 * @param slug - Page slug
 * @returns Full API response or null
 */
export async function getComparisonPageFull(
  slug: string
): Promise<ComparisonPageResponse | null> {
  if (!API_URL) {
    console.warn("[comparisons] NEXT_PUBLIC_API_URL not set");
    return null;
  }

  try {
    const res = await fetch(`${API_URL}/api/content/comparisons/${slug}`, {
      next: { revalidate: 3600 },
    });

    if (res.ok) {
      return res.json();
    }

    if (res.status === 404) {
      return null;
    }

    console.error("[comparisons] Failed to fetch:", res.status);
    return null;
  } catch (error) {
    console.error("[comparisons] Error:", error);
    return null;
  }
}
