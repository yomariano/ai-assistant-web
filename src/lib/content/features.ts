import { supabaseServer, FeaturePage } from "../supabase-server";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getFeaturePages(): Promise<FeaturePage[]> {
  if (API_URL) {
    try {
      const res = await fetch(`${API_URL}/api/content/features`, {
        next: { revalidate: 3600 },
      });

      if (res.ok) {
        return res.json();
      }
    } catch {
      // Fallback to direct Supabase
    }
  }

  const { data, error } = await supabaseServer
    .from("feature_pages")
    .select(
      "id, slug, feature_name, headline, subheadline, hero_image_url, published_at, updated_at"
    )
    .eq("status", "published")
    .order("feature_name", { ascending: true });

  if (error) {
    console.error("Error fetching feature pages:", error);
    return [];
  }

  return (data as FeaturePage[]) || [];
}

export async function getFeaturePage(slug: string): Promise<FeaturePage | null> {
  if (API_URL) {
    try {
      const res = await fetch(`${API_URL}/api/content/features/${slug}`, {
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
    .from("feature_pages")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return null;
    }
    console.error("Error fetching feature page:", error);
    return null;
  }

  return data as FeaturePage;
}

export async function getFeatureSlugs(): Promise<string[]> {
  const { data, error } = await supabaseServer
    .from("feature_pages")
    .select("slug")
    .eq("status", "published");

  if (error) {
    console.error("Error fetching feature slugs:", error);
    return [];
  }

  return data?.map((page) => page.slug) || [];
}

export async function getRelatedFeatures(
  slugs: string[]
): Promise<Pick<FeaturePage, "slug" | "feature_name" | "headline">[]> {
  if (!slugs.length) return [];

  const { data, error } = await supabaseServer
    .from("feature_pages")
    .select("slug, feature_name, headline")
    .in("slug", slugs)
    .eq("status", "published");

  if (error) {
    console.error("Error fetching related features:", error);
    return [];
  }

  return data || [];
}
