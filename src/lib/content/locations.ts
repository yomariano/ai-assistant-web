import type { LocationPage } from "../supabase-server";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_URL) {
  console.warn('[locations] NEXT_PUBLIC_API_URL is not set - content API calls will fail');
}

export async function getLocationPages(state?: string): Promise<LocationPage[]> {
  if (!API_URL) return [];

  try {
    const params = state ? `?state=${state}` : "";
    const res = await fetch(`${API_URL}/api/content/locations${params}`, {
      next: { revalidate: 3600 },
    });

    if (res.ok) {
      return res.json();
    }

    console.error("[locations] Failed to fetch location pages:", res.status);
    return [];
  } catch (error) {
    console.error("[locations] Error fetching location pages:", error);
    return [];
  }
}

export async function getLocationPage(slug: string): Promise<LocationPage | null> {
  if (!API_URL) return null;

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

    console.error("[locations] Failed to fetch location page:", res.status);
    return null;
  } catch (error) {
    console.error("[locations] Error fetching location page:", error);
    return null;
  }
}

export async function getLocationSlugs(): Promise<string[]> {
  if (!API_URL) return [];

  try {
    const res = await fetch(`${API_URL}/api/content/sitemap-data`, {
      next: { revalidate: 3600 },
    });

    if (res.ok) {
      const data = await res.json();
      return data.locations?.map((page: { slug: string }) => page.slug) || [];
    }

    console.error("[locations] Failed to fetch location slugs:", res.status);
    return [];
  } catch (error) {
    console.error("[locations] Error fetching location slugs:", error);
    return [];
  }
}

export async function getNearbyLocations(
  slugs: string[]
): Promise<Pick<LocationPage, "slug" | "city_name" | "state_code">[]> {
  if (!API_URL || !slugs.length) return [];

  try {
    const res = await fetch(
      `${API_URL}/api/content/locations/nearby?slugs=${slugs.join(",")}`,
      {
        next: { revalidate: 3600 },
      }
    );

    if (res.ok) {
      return res.json();
    }

    console.error("[locations] Failed to fetch nearby locations:", res.status);
    return [];
  } catch (error) {
    console.error("[locations] Error fetching nearby locations:", error);
    return [];
  }
}
