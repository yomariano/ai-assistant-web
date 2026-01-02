export const SEO_CONFIG = {
  siteName: "ValidateCall",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://validatecall.com",
  defaultOgImage: "/og-image.jpg",
  twitterHandle: "@validatecall",
  defaultDescription:
    "AI Voice Agents that make phone calls on your behalf. Save hours, avoid hold times, and get results faster with automated phone calls.",
  defaultKeywords: [
    "AI voice assistant",
    "automated phone calls",
    "AI agent",
    "phone automation",
    "call scheduling",
    "voice AI",
    "phone call AI",
    "virtual assistant",
    "AI caller",
    "automated calling",
  ],
} as const;

export const PAGE_PRIORITIES = {
  home: 1,
  blog: 0.8,
  blogPost: 0.7,
  useCase: 0.8,
  location: 0.6,
  feature: 0.8,
  legal: 0.3,
  auth: 0.5,
} as const;

export const CHANGE_FREQUENCIES = {
  daily: "daily",
  weekly: "weekly",
  monthly: "monthly",
  yearly: "yearly",
} as const;
