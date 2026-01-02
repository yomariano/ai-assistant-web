import { supabaseServer, LocationPage } from "../supabase-server";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getLocationPages(state?: string): Promise<LocationPage[]> {
  if (API_URL) {
    try {
      const params = state ? `?state=${state}` : "";
      const res = await fetch(`${API_URL}/api/content/locations${params}`, {
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
    .from("location_pages")
    .select(
      "id, slug, city_name, state_code, country_code, headline, subheadline, hero_image_url, published_at, updated_at"
    )
    .eq("status", "published")
    .order("city_name", { ascending: true });

  if (state) {
    query = query.eq("state_code", state);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching location pages:", error);
    return [];
  }

  return (data as LocationPage[]) || [];
}

export async function getLocationPage(slug: string): Promise<LocationPage | null> {
  if (API_URL) {
    try {
      const res = await fetch(`${API_URL}/api/content/locations/${slug}`, {
        next: { revalidate: 3600 },
      });

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
    .from("location_pages")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return null;
    }
    console.error("Error fetching location page:", error);
    return null;
  }

  return data as LocationPage;
}

export async function getLocationSlugs(): Promise<string[]> {
  const { data, error } = await supabaseServer
    .from("location_pages")
    .select("slug")
    .eq("status", "published");

  if (error) {
    console.error("Error fetching location slugs:", error);
    return [];
  }

  return data?.map((page) => page.slug) || [];
}

export async function getNearbyLocations(
  slugs: string[]
): Promise<Pick<LocationPage, "slug" | "city_name" | "state_code">[]> {
  if (!slugs.length) return [];

  const { data, error } = await supabaseServer
    .from("location_pages")
    .select("slug, city_name, state_code")
    .in("slug", slugs)
    .eq("status", "published");

  if (error) {
    console.error("Error fetching nearby locations:", error);
    return [];
  }

  return data || [];
}
