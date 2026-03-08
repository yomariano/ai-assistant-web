/**
 * Maps industry slugs (used in /for/{slug} and combo pages) to directory vertical slugs.
 */
const INDUSTRY_TO_DIRECTORY: Record<string, { slug: string; label: string }> = {
  "dental-practices": { slug: "dentists", label: "dental practices" },
  "dentists": { slug: "dentists", label: "dental practices" },
  "restaurants": { slug: "restaurants", label: "restaurants" },
  "beauty-salons": { slug: "salons", label: "hair salons" },
  "salons": { slug: "salons", label: "hair salons" },
  "hair-salons": { slug: "salons", label: "hair salons" },
  "spas": { slug: "spas", label: "spas" },
  "veterinary": { slug: "vets", label: "veterinary clinics" },
  "vets": { slug: "vets", label: "veterinary clinics" },
  "veterinary-clinics": { slug: "vets", label: "veterinary clinics" },
  "physiotherapy": { slug: "physios", label: "physiotherapy practices" },
  "physios": { slug: "physios", label: "physiotherapy practices" },
  "gyms": { slug: "gyms", label: "gyms" },
  "fitness": { slug: "gyms", label: "gyms" },
  "mechanics": { slug: "mechanics", label: "mechanics" },
  "auto-repair": { slug: "mechanics", label: "mechanics" },
  "plumbers": { slug: "plumbers", label: "plumbing services" },
  "electricians": { slug: "electricians", label: "electricians" },
  "contractors": { slug: "contractors", label: "contractors" },
  "general-contractors": { slug: "contractors", label: "contractors" },
  "law-firms": { slug: "solicitors", label: "law firms" },
  "solicitors": { slug: "solicitors", label: "solicitors" },
  "real-estate": { slug: "estate-agents", label: "estate agents" },
  "real-estate-agencies": { slug: "estate-agents", label: "estate agents" },
  "estate-agents": { slug: "estate-agents", label: "estate agents" },
};

/**
 * Blog categories/tags to directory vertical mapping.
 */
const CATEGORY_TO_DIRECTORY: Record<string, { slug: string; label: string }> = {
  "dental": { slug: "dentists", label: "dental practices" },
  "dentist": { slug: "dentists", label: "dental practices" },
  "restaurant": { slug: "restaurants", label: "restaurants" },
  "restaurants": { slug: "restaurants", label: "restaurants" },
  "hospitality": { slug: "restaurants", label: "restaurants" },
  "salon": { slug: "salons", label: "hair salons" },
  "salons": { slug: "salons", label: "hair salons" },
  "beauty": { slug: "salons", label: "hair salons" },
  "spa": { slug: "spas", label: "spas" },
  "spas": { slug: "spas", label: "spas" },
  "veterinary": { slug: "vets", label: "veterinary clinics" },
  "vet": { slug: "vets", label: "veterinary clinics" },
  "physiotherapy": { slug: "physios", label: "physiotherapy practices" },
  "gym": { slug: "gyms", label: "gyms" },
  "fitness": { slug: "gyms", label: "gyms" },
  "mechanic": { slug: "mechanics", label: "mechanics" },
  "automotive": { slug: "mechanics", label: "mechanics" },
  "plumber": { slug: "plumbers", label: "plumbing services" },
  "plumbing": { slug: "plumbers", label: "plumbing services" },
  "electrician": { slug: "electricians", label: "electricians" },
  "electricians": { slug: "electricians", label: "electricians" },
  "contractor": { slug: "contractors", label: "contractors" },
  "contractors": { slug: "contractors", label: "contractors" },
  "law": { slug: "solicitors", label: "law firms" },
  "legal": { slug: "solicitors", label: "law firms" },
  "lawyer": { slug: "solicitors", label: "law firms" },
  "lawyers": { slug: "solicitors", label: "law firms" },
  "solicitor": { slug: "solicitors", label: "solicitors" },
  "solicitors": { slug: "solicitors", label: "solicitors" },
  "real-estate": { slug: "estate-agents", label: "estate agents" },
  "property": { slug: "estate-agents", label: "estate agents" },
  "estate-agent": { slug: "estate-agents", label: "estate agents" },
  "estate-agents": { slug: "estate-agents", label: "estate agents" },
  "trades": { slug: "contractors", label: "trade services" },
};

export function getDirectoryVertical(industrySlug: string): { slug: string; label: string } | null {
  return INDUSTRY_TO_DIRECTORY[industrySlug] ?? null;
}

export function getDirectoryFromCategoryOrTags(
  category?: string | null,
  tags?: string[] | null
): { slug: string; label: string } | null {
  if (category) {
    const key = category.toLowerCase().trim();
    if (CATEGORY_TO_DIRECTORY[key]) return CATEGORY_TO_DIRECTORY[key];
  }

  if (tags) {
    for (const tag of tags) {
      const key = tag.toLowerCase().trim();
      if (CATEGORY_TO_DIRECTORY[key]) return CATEGORY_TO_DIRECTORY[key];
    }
  }

  return null;
}
