import type { BlogPost } from "../supabase-server";

// Use server-side env var (runtime) with fallback to NEXT_PUBLIC_ (build-time)
// Server components can access non-NEXT_PUBLIC_ vars at runtime
const API_URL = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL;

if (!API_URL) {
  console.warn('[blog] Neither API_URL nor NEXT_PUBLIC_API_URL is set - content API calls will fail');
}

export async function getBlogPosts(options?: {
  category?: string;
  tag?: string;
  limit?: number;
  offset?: number;
}): Promise<BlogPost[]> {
  if (!API_URL) return [];

  try {
    const params = new URLSearchParams();
    if (options?.category) params.set("category", options.category);
    if (options?.tag) params.set("tag", options.tag);
    if (options?.limit) params.set("limit", String(options.limit));
    if (options?.offset) params.set("offset", String(options.offset));

    const res = await fetch(`${API_URL}/api/content/blog?${params}`, {
      cache: 'no-store', // Always fetch fresh data
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
  if (!API_URL) return null;

  try {
    const res = await fetch(`${API_URL}/api/content/blog/${slug}`, {
      next: { revalidate: 3600 },
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
  if (!API_URL) return [];

  try {
    const res = await fetch(`${API_URL}/api/content/sitemap-data`, {
      next: { revalidate: 3600 },
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
  if (!API_URL) return [];

  try {
    const params = new URLSearchParams();
    params.set("exclude", currentSlug);
    params.set("limit", String(limit));
    if (category) params.set("category", category);

    const res = await fetch(`${API_URL}/api/content/blog/related?${params}`, {
      next: { revalidate: 3600 },
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
