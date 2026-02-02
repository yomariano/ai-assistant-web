import type { FeaturePage } from "../supabase-server";

/**
 * Get API URL at request time (not module load time)
 */
function getApiUrl(): string | undefined {
  return process.env.API_URL || process.env.NEXT_PUBLIC_API_URL;
}

export async function getFeaturePages(): Promise<FeaturePage[]> {
  const apiUrl = getApiUrl();
  if (!apiUrl) {
    console.warn('[features] API_URL not configured');
    return [];
  }

  try {
    const res = await fetch(`${apiUrl}/api/content/features`, {
      cache: 'no-store',
    });

    if (res.ok) {
      return res.json();
    }

    console.error("[features] Failed to fetch feature pages:", res.status);
    return [];
  } catch (error) {
    console.error("[features] Error fetching feature pages:", error);
    return [];
  }
}

export async function getFeaturePage(slug: string): Promise<FeaturePage | null> {
  const apiUrl = getApiUrl();
  if (!apiUrl) {
    console.warn('[features] API_URL not configured');
    return null;
  }

  try {
    const res = await fetch(`${apiUrl}/api/content/features/${slug}`, {
      cache: 'no-store',
    });

    if (res.ok) {
      return res.json();
    }

    if (res.status === 404) {
      return null;
    }

    console.error("[features] Failed to fetch feature page:", res.status);
    return null;
  } catch (error) {
    console.error("[features] Error fetching feature page:", error);
    return null;
  }
}

export async function getFeatureSlugs(): Promise<string[]> {
  const apiUrl = getApiUrl();
  if (!apiUrl) {
    console.warn('[features] API_URL not configured');
    return [];
  }

  try {
    const res = await fetch(`${apiUrl}/api/content/sitemap-data`, {
      cache: 'no-store',
    });

    if (res.ok) {
      const data = await res.json();
      return data.features?.map((page: { slug: string }) => page.slug) || [];
    }

    console.error("[features] Failed to fetch feature slugs:", res.status);
    return [];
  } catch (error) {
    console.error("[features] Error fetching feature slugs:", error);
    return [];
  }
}

export async function getRelatedFeatures(
  slugs: string[]
): Promise<Pick<FeaturePage, "slug" | "feature_name" | "headline">[]> {
  const apiUrl = getApiUrl();
  if (!apiUrl || !slugs.length) {
    return [];
  }

  try {
    const res = await fetch(
      `${apiUrl}/api/content/features/by-slugs?slugs=${slugs.join(",")}`,
      {
        cache: 'no-store',
      }
    );

    if (res.ok) {
      return res.json();
    }

    console.error("[features] Failed to fetch related features:", res.status);
    return [];
  } catch (error) {
    console.error("[features] Error fetching related features:", error);
    return [];
  }
}
