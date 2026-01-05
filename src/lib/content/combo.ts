import { supabaseServer, ComboPage } from "../supabase-server";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

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
  const { location, industry, limit = 100, offset = 0 } = options || {};

  if (API_URL) {
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
    } catch {
      // Fallback to direct Supabase
    }
  }

  let query = supabaseServer
    .from("combo_pages")
    .select(
      "id, slug, location_slug, industry_slug, city_name, industry_name, headline, subheadline, published_at, updated_at"
    )
    .eq("status", "published")
    .order("city_name", { ascending: true })
    .range(offset, offset + limit - 1);

  if (location) {
    query = query.eq("location_slug", location);
  }

  if (industry) {
    query = query.eq("industry_slug", industry);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching combo pages:", error);
    return [];
  }

  return (data as ComboPageSummary[]) || [];
}

export async function getComboPage(
  industry: string,
  location: string
): Promise<ComboPage | null> {
  if (API_URL) {
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
    } catch {
      // Fallback to direct Supabase
    }
  }

  const { data, error } = await supabaseServer
    .from("combo_pages")
    .select("*")
    .eq("industry_slug", industry)
    .eq("location_slug", location)
    .eq("status", "published")
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return null;
    }
    console.error("Error fetching combo page:", error);
    return null;
  }

  return data as ComboPage;
}

export async function getComboSlugs(): Promise<
  { industry: string; location: string }[]
> {
  const { data, error } = await supabaseServer
    .from("combo_pages")
    .select("industry_slug, location_slug")
    .eq("status", "published");

  if (error) {
    console.error("Error fetching combo slugs:", error);
    return [];
  }

  return (
    data?.map((page) => ({
      industry: page.industry_slug,
      location: page.location_slug,
    })) || []
  );
}

export async function getRelatedCombos(
  currentIndustry: string,
  currentLocation: string,
  limit: number = 6
): Promise<ComboPageSummary[]> {
  // Get combos with same industry OR same location (excluding current)
  const { data, error } = await supabaseServer
    .from("combo_pages")
    .select(
      "id, slug, location_slug, industry_slug, city_name, industry_name, headline, subheadline, published_at, updated_at"
    )
    .eq("status", "published")
    .or(`industry_slug.eq.${currentIndustry},location_slug.eq.${currentLocation}`)
    .not("industry_slug", "eq", currentIndustry)
    .not("location_slug", "eq", currentLocation)
    .limit(limit);

  if (error) {
    console.error("Error fetching related combos:", error);
    return [];
  }

  return (data as ComboPageSummary[]) || [];
}
