export interface ReceptionistIndustry {
  slug: string;
  label: string;
  singular: string;
  useCaseHref: string;
  directoryHref: string;
}

const INDUSTRIES: Record<string, ReceptionistIndustry> = {
  dental: {
    slug: "dental",
    label: "Dental Practices",
    singular: "dental practice",
    useCaseHref: "/for/dental-practices",
    directoryHref: "/directory/dentists",
  },
  restaurants: {
    slug: "restaurants",
    label: "Restaurants",
    singular: "restaurant",
    useCaseHref: "/for/restaurants",
    directoryHref: "/directory/restaurants",
  },
  salons: {
    slug: "salons",
    label: "Hair Salons",
    singular: "hair salon",
    useCaseHref: "/for/beauty-salons",
    directoryHref: "/directory/salons",
  },
  plumbers: {
    slug: "plumbers",
    label: "Plumbers",
    singular: "plumbing business",
    useCaseHref: "/for/plumbers",
    directoryHref: "/directory/plumbers",
  },
};

const ALIASES: Record<string, keyof typeof INDUSTRIES> = {
  dentists: "dental",
  restaurant: "restaurants",
  salon: "salons",
  "beauty-salons": "salons",
  "hair-salons": "salons",
  plumber: "plumbers",
};

export function getReceptionistIndustry(slug: string): ReceptionistIndustry | null {
  const canonicalSlug = INDUSTRIES[slug] ? slug : ALIASES[slug];
  return canonicalSlug ? INDUSTRIES[canonicalSlug] : null;
}

export function getReceptionistIndustrySlugs(): string[] {
  return Object.keys(INDUSTRIES);
}
