import { supabaseServer, UseCasePage } from "../supabase-server";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getUseCasePages(): Promise<UseCasePage[]> {
  if (API_URL) {
    try {
      const res = await fetch(`${API_URL}/api/content/use-cases`, {
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
    .from("use_case_pages")
    .select(
      "id, slug, industry_name, headline, subheadline, hero_image_url, published_at, updated_at"
    )
    .eq("status", "published")
    .order("industry_name", { ascending: true });

  if (error) {
    console.error("Error fetching use case pages:", error);
    return [];
  }

  return (data as UseCasePage[]) || [];
}

export async function getUseCasePage(slug: string): Promise<UseCasePage | null> {
  if (API_URL) {
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
    } catch {
      // Fallback to direct Supabase
    }
  }

  const { data, error } = await supabaseServer
    .from("use_case_pages")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return null;
    }
    console.error("Error fetching use case page:", error);
    return null;
  }

  return data as UseCasePage;
}

export async function getUseCaseSlugs(): Promise<string[]> {
  const { data, error } = await supabaseServer
    .from("use_case_pages")
    .select("slug")
    .eq("status", "published");

  if (error) {
    console.error("Error fetching use case slugs:", error);
    return [];
  }

  return data?.map((page) => page.slug) || [];
}
