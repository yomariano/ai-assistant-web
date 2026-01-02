import { Metadata } from "next";

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://validatecall.com";
const SITE_NAME = "ValidateCall";
const DEFAULT_OG_IMAGE = `${BASE_URL}/og-image.jpg`;
const TWITTER_HANDLE = "@validatecall";

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

export function generateBlogMetadata(post: {
  title: string;
  excerpt: string;
  slug: string;
  meta_title?: string;
  meta_description?: string;
  og_image_url?: string;
  featured_image_url?: string;
  published_at: string;
  updated_at: string;
  author_name: string;
  tags?: string[];
}): Metadata {
  return generatePageMetadata({
    title: post.meta_title || post.title,
    description: post.meta_description || post.excerpt,
    path: `/blog/${post.slug}`,
    ogImage: post.og_image_url || post.featured_image_url,
    type: "article",
    publishedTime: post.published_at,
    modifiedTime: post.updated_at,
    author: post.author_name,
    keywords: post.tags,
  });
}

export function generateUseCaseMetadata(page: {
  slug: string;
  industry_name: string;
  headline: string;
  subheadline: string;
  meta_title?: string;
  meta_description?: string;
  og_image_url?: string;
  hero_image_url?: string;
}): Metadata {
  return generatePageMetadata({
    title:
      page.meta_title || `AI Voice Assistant for ${page.industry_name}`,
    description:
      page.meta_description ||
      page.subheadline ||
      `Automated phone calls for ${page.industry_name}. Save time with AI voice agents.`,
    path: `/for/${page.slug}`,
    ogImage: page.og_image_url || page.hero_image_url,
    keywords: [
      `AI voice assistant ${page.industry_name}`,
      `${page.industry_name} automation`,
      `phone calls ${page.industry_name}`,
    ],
  });
}

export function generateLocationMetadata(page: {
  slug: string;
  city_name: string;
  state_code: string;
  headline: string;
  subheadline?: string;
  meta_title?: string;
  meta_description?: string;
  og_image_url?: string;
  hero_image_url?: string;
}): Metadata {
  return generatePageMetadata({
    title:
      page.meta_title ||
      `AI Voice Assistant in ${page.city_name}, ${page.state_code}`,
    description:
      page.meta_description ||
      page.subheadline ||
      `Automated phone calls for businesses in ${page.city_name}. Save time with AI voice agents.`,
    path: `/in/${page.slug}`,
    ogImage: page.og_image_url || page.hero_image_url,
    keywords: [
      `AI voice assistant ${page.city_name}`,
      `automated calls ${page.city_name}`,
      `phone automation ${page.state_code}`,
    ],
  });
}

export function generateFeatureMetadata(page: {
  slug: string;
  feature_name: string;
  headline: string;
  subheadline?: string;
  meta_title?: string;
  meta_description?: string;
  og_image_url?: string;
  hero_image_url?: string;
}): Metadata {
  return generatePageMetadata({
    title: page.meta_title || page.feature_name,
    description:
      page.meta_description ||
      page.subheadline ||
      `Learn about ${page.feature_name}. Powerful AI voice assistant features for automated phone calls.`,
    path: `/features/${page.slug}`,
    ogImage: page.og_image_url || page.hero_image_url,
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
