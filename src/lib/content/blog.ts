import { supabaseServer, BlogPost } from "../supabase-server";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getBlogPosts(options?: {
  category?: string;
  tag?: string;
  limit?: number;
  offset?: number;
}): Promise<BlogPost[]> {
  // Try API first, fallback to direct Supabase
  if (API_URL) {
    try {
      const params = new URLSearchParams();
      if (options?.category) params.set("category", options.category);
      if (options?.tag) params.set("tag", options.tag);
      if (options?.limit) params.set("limit", String(options.limit));
      if (options?.offset) params.set("offset", String(options.offset));

      const res = await fetch(`${API_URL}/api/content/blog?${params}`, {
        next: { revalidate: 3600 },
      });

      if (res.ok) {
        return res.json();
      }
    } catch {
      // Fallback to direct Supabase
    }
  }

  // Direct Supabase query
  let query = supabaseServer
    .from("blog_posts")
    .select(
      "id, slug, title, excerpt, featured_image_url, featured_image_alt, author_name, author_avatar_url, category, tags, published_at, updated_at"
    )
    .eq("status", "published")
    .order("published_at", { ascending: false });

  if (options?.category) {
    query = query.eq("category", options.category);
  }

  if (options?.tag) {
    query = query.contains("tags", [options.tag]);
  }

  if (options?.limit) {
    const offset = options.offset || 0;
    query = query.range(offset, offset + options.limit - 1);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching blog posts:", error);
    return [];
  }

  return (data as BlogPost[]) || [];
}

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  // Try API first
  if (API_URL) {
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
    } catch {
      // Fallback to direct Supabase
    }
  }

  // Direct Supabase query
  const { data, error } = await supabaseServer
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return null;
    }
    console.error("Error fetching blog post:", error);
    return null;
  }

  return data as BlogPost;
}

export async function getBlogPostSlugs(): Promise<string[]> {
  const { data, error } = await supabaseServer
    .from("blog_posts")
    .select("slug")
    .eq("status", "published");

  if (error) {
    console.error("Error fetching blog post slugs:", error);
    return [];
  }

  return data?.map((post) => post.slug) || [];
}

export async function getRelatedPosts(
  currentSlug: string,
  category?: string | null,
  tags?: string[] | null,
  limit = 3
): Promise<BlogPost[]> {
  let query = supabaseServer
    .from("blog_posts")
    .select(
      "id, slug, title, excerpt, featured_image_url, featured_image_alt, author_name, published_at"
    )
    .eq("status", "published")
    .neq("slug", currentSlug)
    .limit(limit);

  if (category) {
    query = query.eq("category", category);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching related posts:", error);
    return [];
  }

  return (data as BlogPost[]) || [];
}
