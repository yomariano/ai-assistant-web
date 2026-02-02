import type { ComboPage } from "../supabase-server";

// Use server-side env var (runtime) with fallback to NEXT_PUBLIC_ (build-time)
const API_URL = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL;

if (!API_URL) {
  console.warn('[combo] Neither API_URL nor NEXT_PUBLIC_API_URL is set');
}

export interface ComboPageSummary {
  id: string;
  slug: string;
  location_slug: string;
  industry_slug: string;
  city_name: string;
  industry_name: string;
  headline: string;
  subheadline: string | null;
  published_at: string | null;
  updated_at: string;
}

export async function getComboPages(options?: {
  location?: string;
  industry?: string;
  limit?: number;
  offset?: number;
}): Promise<ComboPageSummary[]> {
  if (!API_URL) return [];

  const { location, industry, limit = 100, offset = 0 } = options || {};

  try {
    const params = new URLSearchParams();
    if (location) params.append("location", location);
    if (industry) params.append("industry", industry);
    params.append("limit", limit.toString());
    params.append("offset", offset.toString());

    const queryString = params.toString() ? `?${params.toString()}` : "";
    const res = await fetch(`${API_URL}/api/content/combo${queryString}`, {
      next: { revalidate: 3600 },
    });

    if (res.ok) {
      return res.json();
    }

    console.error("[combo] Failed to fetch combo pages:", res.status);
    return [];
  } catch (error) {
    console.error("[combo] Error fetching combo pages:", error);
    return [];
  }
}

export async function getComboPage(
  industry: string,
  location: string
): Promise<ComboPage | null> {
  if (!API_URL) return null;

  try {
    const res = await fetch(
      `${API_URL}/api/content/combo/${industry}/${location}`,
      {
        next: { revalidate: 3600 },
      }
    );

    if (res.ok) {
      return res.json();
    }

    if (res.status === 404) {
      return null;
    }

    console.error("[combo] Failed to fetch combo page:", res.status);
    return null;
  } catch (error) {
    console.error("[combo] Error fetching combo page:", error);
    return null;
  }
}

export async function getComboSlugs(): Promise<
  { industry: string; location: string }[]
> {
  if (!API_URL) return [];

  try {
    const res = await fetch(`${API_URL}/api/content/sitemap-data`, {
      next: { revalidate: 3600 },
    });

    if (res.ok) {
      const data = await res.json();
      return (
        data.combos?.map((page: { industry_slug: string; location_slug: string }) => ({
          industry: page.industry_slug,
          location: page.location_slug,
        })) || []
      );
    }

    console.error("[combo] Failed to fetch combo slugs:", res.status);
    return [];
  } catch (error) {
    console.error("[combo] Error fetching combo slugs:", error);
    return [];
  }
}

export async function getRelatedCombos(
  currentIndustry: string,
  currentLocation: string,
  limit: number = 6
): Promise<ComboPageSummary[]> {
  if (!API_URL) return [];

  try {
    const params = new URLSearchParams();
    params.set("industry", currentIndustry);
    params.set("location", currentLocation);
    params.set("limit", String(limit));

    const res = await fetch(`${API_URL}/api/content/combo/related?${params}`, {
      next: { revalidate: 3600 },
    });

    if (res.ok) {
      return res.json();
    }

    console.error("[combo] Failed to fetch related combos:", res.status);
    return [];
  } catch (error) {
    console.error("[combo] Error fetching related combos:", error);
    return [];
  }
}
