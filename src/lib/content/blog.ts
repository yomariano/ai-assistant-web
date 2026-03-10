import type { BlogPost } from "../supabase-server";

function normalizeBlogSlug(slug: string): string {
  return slug
    .trim()
    .replace(/^\/+/, "")
    .replace(/^(?:es\/)?blog\//i, "")
    .replace(/\/+$/, "")
    .replace(/\/-([2-9]|[1-9]\d+)$/, "-$1");
}

interface SitemapBlogPost {
  slug: string;
  language?: string;
}

/**
 * Get API URL at request time (not module load time)
 * This is critical for Next.js standalone builds where env vars
 * need to be read fresh on each request
 */
function getApiUrl(): string | undefined {
  return process.env.API_URL || process.env.NEXT_PUBLIC_API_URL;
}

async function fetchBlogSitemapPosts(apiUrl: string): Promise<SitemapBlogPost[]> {
  try {
    const res = await fetch(`${apiUrl}/api/content/sitemap-data`, {
      cache: "no-store",
    });

    if (!res.ok) {
      return [];
    }

    const data = await res.json();
    return Array.isArray(data.blogPosts) ? data.blogPosts : [];
  } catch (error) {
    console.error("[blog] Error fetching blog post slugs:", error);
    return [];
  }
}

async function requestBlogPost(
  apiUrl: string,
  slug: string,
  language?: string,
): Promise<BlogPost | null> {
  const params = new URLSearchParams();
  if (language) params.set("language", language);
  const query = params.toString();

  const encodedSlug = encodeURIComponent(slug);
  const res = await fetch(`${apiUrl}/api/content/blog/${encodedSlug}${query ? `?${query}` : ""}`, {
    cache: "no-store",
  });

  if (res.ok) {
    return res.json();
  }

  if (res.status === 404) {
    return null;
  }

  console.error("[blog] Failed to fetch blog post:", res.status);
  return null;
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

async function fetchBlogPost(
  slug: string,
  options?: {
    language?: string;
  }
): Promise<BlogPost | null> {
  const apiUrl = getApiUrl();
  if (!apiUrl) {
    console.warn('[blog] API_URL not configured');
    return null;
  }

  try {
    const normalizedSlug = normalizeBlogSlug(slug);
    const candidates = new Set<string>([
      normalizedSlug,
      slug.trim().replace(/^\/+/, "").replace(/\/+$/, ""),
    ]);

    const sitemapPosts = await fetchBlogSitemapPosts(apiUrl);
    for (const post of sitemapPosts) {
      if (normalizeBlogSlug(post.slug) !== normalizedSlug) {
        continue;
      }
      if (options?.language && (post.language || "en") !== options.language) {
        continue;
      }
      candidates.add(post.slug);
    }

    for (const candidate of candidates) {
      if (!candidate) {
        continue;
      }

      const post = await requestBlogPost(apiUrl, candidate, options?.language);
      if (post) {
        return post;
      }
    }

    return null;
  } catch (error) {
    console.error("[blog] Error fetching blog post:", error);
    return null;
  }
}

export async function getBlogPost(
  slug: string,
  options?: {
    language?: string;
  }
): Promise<BlogPost | null> {
  return fetchBlogPost(slug, options);
}

export async function getBlogPostSlugs(language?: string): Promise<string[]> {
  const apiUrl = getApiUrl();
  if (!apiUrl) {
    console.warn('[blog] API_URL not configured');
    return [];
  }

  try {
    const posts = await fetchBlogSitemapPosts(apiUrl);
    return posts
      .filter((post) => !language || (post.language || "en") === language)
      .map((post) => normalizeBlogSlug(post.slug))
      .filter(Boolean);
  } catch {
    return [];
  }
}

export async function getRelatedPosts(
  currentSlug: string,
  category?: string | null,
  tags?: string[] | null,
  limit = 3,
  language?: string
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
    if (language) params.set("language", language);

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
