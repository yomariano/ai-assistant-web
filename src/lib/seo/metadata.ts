import { Metadata } from "next";
import type { BlogPost, FeaturePage, LocationPage, UseCasePage } from "@/lib/supabase-server";

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://voicefleet.ai";
const SITE_NAME = "VoiceFleet";
const DEFAULT_OG_IMAGE = `${BASE_URL}/og-image.jpg`;
const TWITTER_HANDLE = "@voicefleetai";

interface GenerateMetadataOptions {
  title: string;
  description: string;
  path: string;
  ogImage?: string;
  noIndex?: boolean;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  keywords?: string[];
}

export function generatePageMetadata(options: GenerateMetadataOptions): Metadata {
  const {
    title,
    description,
    path,
    ogImage = DEFAULT_OG_IMAGE,
    noIndex = false,
    type = "website",
    publishedTime,
    modifiedTime,
    author,
    keywords,
  } = options;

  const url = `${BASE_URL}${path}`;
  const fullOgImage = ogImage.startsWith("http") ? ogImage : `${BASE_URL}${ogImage}`;

  return {
    title,
    description,
    ...(keywords && { keywords }),
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
    alternates: {
      canonical: url,
    },
    openGraph: {
      type,
      url,
      title,
      description,
      siteName: SITE_NAME,
      images: [
        {
          url: fullOgImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      ...(type === "article" && {
        publishedTime,
        modifiedTime,
        authors: author ? [author] : undefined,
      }),
    },
    twitter: {
      card: "summary_large_image",
      site: TWITTER_HANDLE,
      creator: TWITTER_HANDLE,
      title,
      description,
      images: [fullOgImage],
    },
  };
}

export function generateBlogMetadata(
  post: Pick<
    BlogPost,
    | "title"
    | "excerpt"
    | "slug"
    | "meta_title"
    | "meta_description"
    | "og_image_url"
    | "featured_image_url"
    | "published_at"
    | "updated_at"
    | "author_name"
    | "tags"
  >
): Metadata {
  return generatePageMetadata({
    title: post.meta_title || post.title,
    description: post.meta_description || post.excerpt || "",
    path: `/blog/${post.slug}`,
    ogImage: post.og_image_url || post.featured_image_url || undefined,
    type: "article",
    publishedTime: post.published_at || undefined,
    modifiedTime: post.updated_at,
    author: post.author_name,
    keywords: post.tags ?? undefined,
  });
}

export function generateUseCaseMetadata(
  page: Pick<
    UseCasePage,
    | "slug"
    | "industry_name"
    | "headline"
    | "subheadline"
    | "meta_title"
    | "meta_description"
    | "og_image_url"
    | "hero_image_url"
  >
): Metadata {
  return generatePageMetadata({
    title:
      page.meta_title || `AI Voice Assistant for ${page.industry_name}`,
    description:
      page.meta_description ||
      page.subheadline ||
      `Automated phone calls for ${page.industry_name}. Save time with AI voice agents.`,
    path: `/for/${page.slug}`,
    ogImage: page.og_image_url || page.hero_image_url || undefined,
    keywords: [
      `AI voice assistant ${page.industry_name}`,
      `${page.industry_name} automation`,
      `phone calls ${page.industry_name}`,
    ],
  });
}

export function generateLocationMetadata(
  page: Pick<
    LocationPage,
    | "slug"
    | "city_name"
    | "state_code"
    | "headline"
    | "subheadline"
    | "meta_title"
    | "meta_description"
    | "og_image_url"
    | "hero_image_url"
  >
): Metadata {
  const stateCode = page.state_code ? `, ${page.state_code}` : "";

  return generatePageMetadata({
    title:
      page.meta_title ||
      `AI Voice Assistant in ${page.city_name}${stateCode}`,
    description:
      page.meta_description ||
      page.subheadline ||
      `Automated phone calls for businesses in ${page.city_name}. Save time with AI voice agents.`,
    path: `/in/${page.slug}`,
    ogImage: page.og_image_url || page.hero_image_url || undefined,
    keywords: [
      `AI voice assistant ${page.city_name}`,
      `automated calls ${page.city_name}`,
      ...(page.state_code ? [`phone automation ${page.state_code}`] : []),
    ],
  });
}

export function generateFeatureMetadata(
  page: Pick<
    FeaturePage,
    | "slug"
    | "feature_name"
    | "headline"
    | "subheadline"
    | "meta_title"
    | "meta_description"
    | "og_image_url"
    | "hero_image_url"
  >
): Metadata {
  return generatePageMetadata({
    title: page.meta_title || page.feature_name,
    description:
      page.meta_description ||
      page.subheadline ||
      `Learn about ${page.feature_name}. Powerful AI voice assistant features for automated phone calls.`,
    path: `/features/${page.slug}`,
    ogImage: page.og_image_url || page.hero_image_url || undefined,
    keywords: [
      page.feature_name,
      "AI voice assistant features",
      "automated calling",
    ],
  });
}

export const seoConstants = {
  BASE_URL,
  SITE_NAME,
  DEFAULT_OG_IMAGE,
  TWITTER_HANDLE,
};
