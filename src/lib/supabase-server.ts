import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Server-side Supabase client for use in React Server Components
// This client is safe to use in server-side code
export const supabaseServer = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

// Content type interfaces
export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string;
  featured_image_url: string | null;
  featured_image_alt: string | null;
  author_name: string;
  author_avatar_url: string | null;
  category: string | null;
  tags: string[] | null;
  status: "draft" | "published" | "archived";
  published_at: string | null;
  created_at: string;
  updated_at: string;
  meta_title: string | null;
  meta_description: string | null;
  og_image_url: string | null;
  canonical_url: string | null;
  no_index: boolean;
}

export interface UseCasePage {
  id: string;
  slug: string;
  industry_name: string;
  headline: string;
  subheadline: string | null;
  hero_image_url: string | null;
  hero_image_alt: string | null;
  problem_statement: string | null;
  solution_description: string | null;
  benefits: Array<{ title: string; description: string; icon?: string }>;
  use_cases: Array<{ title: string; description: string; example?: string }>;
  testimonial: {
    quote: string;
    author: string;
    company: string;
    avatar_url?: string;
  } | null;
  cta_text: string;
  cta_url: string;
  status: "draft" | "published" | "archived";
  published_at: string | null;
  created_at: string;
  updated_at: string;
  meta_title: string | null;
  meta_description: string | null;
  og_image_url: string | null;
  canonical_url: string | null;
  related_features: string[];
  related_locations: string[];
}

export interface LocationPage {
  id: string;
  slug: string;
  city_name: string;
  state_code: string | null;
  country_code: string;
  headline: string;
  subheadline: string | null;
  hero_image_url: string | null;
  hero_image_alt: string | null;
  local_description: string | null;
  local_benefits: Array<{ title: string; description: string }>;
  local_stats: Record<string, string | number> | null;
  local_testimonial: {
    quote: string;
    author: string;
    company: string;
  } | null;
  nearby_locations: string[];
  status: "draft" | "published" | "archived";
  published_at: string | null;
  created_at: string;
  updated_at: string;
  meta_title: string | null;
  meta_description: string | null;
  og_image_url: string | null;
  canonical_url: string | null;
  latitude: number | null;
  longitude: number | null;
}

export interface FeaturePage {
  id: string;
  slug: string;
  feature_name: string;
  headline: string;
  subheadline: string | null;
  hero_image_url: string | null;
  hero_image_alt: string | null;
  overview: string | null;
  how_it_works: Array<{
    step: number;
    title: string;
    description: string;
    icon?: string;
  }>;
  benefits: Array<{ title: string; description: string }>;
  technical_specs: Record<string, string> | null;
  comparison: Array<{ feature: string; us: string; competitors: string }> | null;
  faq: Array<{ question: string; answer: string }>;
  status: "draft" | "published" | "archived";
  published_at: string | null;
  created_at: string;
  updated_at: string;
  meta_title: string | null;
  meta_description: string | null;
  og_image_url: string | null;
  canonical_url: string | null;
  related_features: string[];
  related_use_cases: string[];
}

export interface ComboPage {
  id: string;
  slug: string;
  location_slug: string;
  industry_slug: string;
  city_name: string;
  industry_name: string;
  headline: string;
  subheadline: string | null;
  hero_image_url: string | null;
  hero_image_alt: string | null;
  content: {
    intro: string;
    why_need: string;
    local_industry_context?: string;
    benefits: Array<{ title: string; description: string }>;
    local_stats?: Record<string, string | number>;
    case_study?: {
      business_name: string;
      challenge: string;
      solution: string;
      results: string[];
    };
    faq: Array<{ question: string; answer: string }>;
    cta_text?: string;
  };
  status: "draft" | "published" | "archived";
  published_at: string | null;
  created_at: string;
  updated_at: string;
  meta_title: string | null;
  meta_description: string | null;
  og_image_url: string | null;
  canonical_url: string | null;
  related_locations: string[];
  related_industries: string[];
}
