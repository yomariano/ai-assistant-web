import type { UseCasePage } from "../supabase-server";

/**
 * Get API URL at request time (not module load time)
 */
function getApiUrl(): string | undefined {
  return process.env.API_URL || process.env.NEXT_PUBLIC_API_URL;
}

export async function getUseCasePages(): Promise<UseCasePage[]> {
  const apiUrl = getApiUrl();
  if (!apiUrl) {
    console.warn('[use-cases] API_URL not configured');
    return [];
  }

  try {
    const res = await fetch(`${apiUrl}/api/content/use-cases`, {
      cache: 'no-store',
    });

    if (res.ok) {
      return res.json();
    }

    console.error("[use-cases] Failed to fetch use case pages:", res.status);
    return [];
  } catch (error) {
    console.error("[use-cases] Error fetching use case pages:", error);
    return [];
  }
}

export async function getUseCasePage(slug: string): Promise<UseCasePage | null> {
  const apiUrl = getApiUrl();
  if (!apiUrl) {
    console.warn('[use-cases] API_URL not configured');
    return null;
  }

  try {
    const res = await fetch(`${apiUrl}/api/content/use-cases/${slug}`, {
      cache: 'no-store',
    });

    if (res.ok) {
      return res.json();
    }

    if (res.status === 404) {
      return null;
    }

    console.error("[use-cases] Failed to fetch use case page:", res.status);
    return null;
  } catch (error) {
    console.error("[use-cases] Error fetching use case page:", error);
    return null;
  }
}

export async function getUseCaseSlugs(): Promise<string[]> {
  const apiUrl = getApiUrl();
  if (!apiUrl) {
    console.warn('[use-cases] API_URL not configured');
    return [];
  }

  try {
    const res = await fetch(`${apiUrl}/api/content/sitemap-data`, {
      cache: 'no-store',
    });

    if (res.ok) {
      const data = await res.json();
      return data.useCases?.map((page: { slug: string }) => page.slug) || [];
    }

    console.error("[use-cases] Failed to fetch use case slugs:", res.status);
    return [];
  } catch (error) {
    console.error("[use-cases] Error fetching use case slugs:", error);
    return [];
  }
}
