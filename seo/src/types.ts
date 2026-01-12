/**
 * VoiceFleet SEO - Shared Types
 */

// Cloudflare Worker Bindings
export type Bindings = {
  SEO_CACHE: KVNamespace;
  CONTENT_CACHE: KVNamespace;
  SITE_URL: string;
  APP_URL: string;
  API_URL: string;
  SEO_WORKER_SECRET: string;
  ADMIN_SECRET: string;
};

// Industry definition with VoiceFleet-specific fields
export interface Industry {
  slug: string;
  name: string;
  namePlural: string;
  description: string;
  metaDescription: string;
  // VoiceFleet-specific metrics
  avgCallsPerMonth: number;
  automationRate: number;
  costSavingsPercent: number;
  avgResponseTime: string;
  // Voice agent capabilities
  primaryUseCases: string[];
  voiceCapabilities: string[];
  painPoints: string[];
  relatedIndustries: string[];
  topLocations: string[];
  keywords: string[];
  icon: string;
}

// Location types
export interface City {
  slug: string;
  name: string;
  country: string;
  countryCode: string;
  population: number;
  region?: string;
  timezone?: string;
}

export interface Country {
  slug: string;
  name: string;
  code: string;
  cities: City[];
  language: string;
  currency: string;
  phoneFormat: string;
}

// AI-generated content structure
export interface GeneratedContent {
  title: string;
  metaDescription: string;
  heroTitle: string;
  heroSubtitle: string;
  // GEO: Clear definition for AI extraction
  definition: string;
  // GEO: Direct answer (inverted pyramid)
  quickAnswer: string;
  introduction: string;
  // GEO: Statistics with context for AI citation
  keyStats: Array<{ stat: string; context: string }>;
  benefits: string[];
  howItWorks: string[];
  painPointsContent: Array<{ title: string; description: string }>;
  useCasesContent: Array<{ title: string; description: string }>;
  // GEO: Question-based FAQ for chunking
  faqItems: Array<{ question: string; answer: string }>;
  ctaText: string;
  trendInsight?: string;
  generatedAt: string;
}

// Content request for generation
export interface ContentRequest {
  type: 'industry' | 'location' | 'industry-location';
  industry?: { name: string; namePlural: string; slug: string };
  location?: { city: string; country: string };
  newsArticles?: NewsArticle[];
}

// News article for content generation
export interface NewsArticle {
  title: string;
  link: string;
  snippet: string;
  source: string;
  pubDate: string;
}
