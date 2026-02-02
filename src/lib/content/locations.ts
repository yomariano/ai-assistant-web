import type { LocationPage } from "../supabase-server";

/**
 * Get API URL at request time (not module load time)
 */
function getApiUrl(): string | undefined {
  return process.env.API_URL || process.env.NEXT_PUBLIC_API_URL;
}

export async function getLocationPages(state?: string): Promise<LocationPage[]> {
  const apiUrl = getApiUrl();
  if (!apiUrl) {
    console.warn('[locations] API_URL not configured');
    return [];
  }

  try {
    const params = state ? `?state=${state}` : "";
    const res = await fetch(`${apiUrl}/api/content/locations${params}`, {
      cache: 'no-store',
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
  const apiUrl = getApiUrl();
  if (!apiUrl) {
    console.warn('[locations] API_URL not configured');
    return null;
  }

  try {
    const res = await fetch(`${apiUrl}/api/content/locations/${slug}`, {
      cache: 'no-store',
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
  const apiUrl = getApiUrl();
  if (!apiUrl) {
    console.warn('[locations] API_URL not configured');
    return [];
  }

  try {
    const res = await fetch(`${apiUrl}/api/content/sitemap-data`, {
      cache: 'no-store',
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
  const apiUrl = getApiUrl();
  if (!apiUrl || !slugs.length) {
    return [];
  }

  try {
    const res = await fetch(
      `${apiUrl}/api/content/locations/nearby?slugs=${slugs.join(",")}`,
      {
        cache: 'no-store',
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
