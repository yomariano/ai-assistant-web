export const SEO_CONFIG = {
  siteName: "VoiceFleet",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://voicefleet.ai",
  defaultOgImage: "/opengraph-image",
  twitterHandle: "@voicefleetai",
  defaultDescription:
    "AI Voice Agents that handle calls at 80% lower cost. Scale support without scaling headcount.",
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
