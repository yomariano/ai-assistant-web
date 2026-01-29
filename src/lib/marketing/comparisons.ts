/**
 * Comparison Page Types
 * Types are kept here for backwards compatibility.
 * Data now comes from the API via @/lib/content/comparisons.ts
 */

export type ComparisonFaqItem = {
  question: string;
  answer: string;
};

export type ComparisonPage = {
  slug: string;
  title: string;
  description: string;
  heroTitle: string;
  heroSubtitle: string;
  whoThisIsFor: string[];
  quickTake: { label: string; value: string }[];
  whenVoiceFleetWins: string[];
  whenAlternativeWins: string[];
  faq: ComparisonFaqItem[];
};

// Re-export API functions for convenience
export {
  getComparisonPages,
  getComparisonPage,
  getComparisonSlugs,
} from "@/lib/content/comparisons";

