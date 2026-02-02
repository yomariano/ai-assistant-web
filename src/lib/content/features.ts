import type { FeaturePage } from "../supabase-server";

// Use server-side env var (runtime) with fallback to NEXT_PUBLIC_ (build-time)
const API_URL = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL;

if (!API_URL) {
  console.warn('[features] Neither API_URL nor NEXT_PUBLIC_API_URL is set');
}

export async function getFeaturePages(): Promise<FeaturePage[]> {
  if (!API_URL) return [];

  try {
    const res = await fetch(`${API_URL}/api/content/features`, {
      next: { revalidate: 3600 },
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
  if (!API_URL) return null;

  try {
    const res = await fetch(`${API_URL}/api/content/features/${slug}`, {
      next: { revalidate: 3600 },
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
  if (!API_URL) return [];

  try {
    const res = await fetch(`${API_URL}/api/content/sitemap-data`, {
      next: { revalidate: 3600 },
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
  if (!API_URL || !slugs.length) return [];

  try {
    const res = await fetch(
      `${API_URL}/api/content/features/by-slugs?slugs=${slugs.join(",")}`,
      {
        next: { revalidate: 3600 },
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
