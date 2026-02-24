import type { BlogPost } from "../supabase-server";

/**
 * Get API URL at request time (not module load time)
 * This is critical for Next.js standalone builds where env vars
 * need to be read fresh on each request
 */
function getApiUrl(): string | undefined {
  return process.env.API_URL || process.env.NEXT_PUBLIC_API_URL;
}

export async function getBlogPosts(options?: {
  category?: string;
  tag?: string;
  language?: string;
  limit?: number;
  offset?: number;
}): Promise<BlogPost[]> {
  const apiUrl = getApiUrl();
  if (!apiUrl) {
    console.warn('[blog] API_URL not configured');
    return [];
  }

  try {
    const params = new URLSearchParams();
    if (options?.category) params.set("category", options.category);
    if (options?.tag) params.set("tag", options.tag);
    if (options?.language) params.set("language", options.language);
    if (options?.limit) params.set("limit", String(options.limit));
    if (options?.offset) params.set("offset", String(options.offset));

    const res = await fetch(`${apiUrl}/api/content/blog?${params}`, {
      cache: 'no-store',
    });

    if (res.ok) {
      return res.json();
    }

    console.error("[blog] Failed to fetch blog posts:", res.status);
    return [];
  } catch (error) {
    console.error("[blog] Error fetching blog posts:", error);
    return [];
  }
}

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  const apiUrl = getApiUrl();
  if (!apiUrl) {
    console.warn('[blog] API_URL not configured');
    return null;
  }

  try {
    const res = await fetch(`${apiUrl}/api/content/blog/${slug}`, {
      cache: 'no-store',
    });

    if (res.ok) {
      return res.json();
    }

    if (res.status === 404) {
      return null;
    }

    console.error("[blog] Failed to fetch blog post:", res.status);
    return null;
  } catch (error) {
    console.error("[blog] Error fetching blog post:", error);
    return null;
  }
}

export async function getBlogPostSlugs(): Promise<string[]> {
  const apiUrl = getApiUrl();
  if (!apiUrl) {
    console.warn('[blog] API_URL not configured');
    return [];
  }

  try {
    const res = await fetch(`${apiUrl}/api/content/sitemap-data`, {
      cache: 'no-store',
    });

    if (res.ok) {
      const data = await res.json();
      return data.blogPosts?.map((post: { slug: string }) => post.slug) || [];
    }

    console.error("[blog] Failed to fetch blog post slugs:", res.status);
    return [];
  } catch (error) {
    console.error("[blog] Error fetching blog post slugs:", error);
    return [];
  }
}

export async function getRelatedPosts(
  currentSlug: string,
  category?: string | null,
  tags?: string[] | null,
  limit = 3
): Promise<BlogPost[]> {
  const apiUrl = getApiUrl();
  if (!apiUrl) {
    console.warn('[blog] API_URL not configured');
    return [];
  }

  try {
    const params = new URLSearchParams();
    params.set("exclude", currentSlug);
    params.set("limit", String(limit));
    if (category) params.set("category", category);

    const res = await fetch(`${apiUrl}/api/content/blog/related?${params}`, {
      cache: 'no-store',
    });

    if (res.ok) {
      return res.json();
    }

    console.error("[blog] Failed to fetch related posts:", res.status);
    return [];
  } catch (error) {
    console.error("[blog] Error fetching related posts:", error);
    return [];
  }
}
