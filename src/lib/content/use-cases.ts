import type { UseCasePage } from "../supabase-server";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_URL) {
  console.warn('[use-cases] NEXT_PUBLIC_API_URL is not set - content API calls will fail');
}

export async function getUseCasePages(): Promise<UseCasePage[]> {
  if (!API_URL) return [];

  try {
    const res = await fetch(`${API_URL}/api/content/use-cases`, {
      next: { revalidate: 3600 },
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
  if (!API_URL) return null;

  try {
    const res = await fetch(`${API_URL}/api/content/use-cases/${slug}`, {
      next: { revalidate: 3600 },
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
  if (!API_URL) return [];

  try {
    const res = await fetch(`${API_URL}/api/content/sitemap-data`, {
      next: { revalidate: 3600 },
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
