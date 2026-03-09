export type SupportedRegion = "EU" | "AR" | "AU" | "US";
export type MarketBasePath = "/" | "/es" | "/au";

interface FallbackPlan {
  id: string;
  price: number;
  formattedPrice: string;
  monthlyMinutes: number;
  paymentLink: null;
}

interface FallbackRegionData {
  region: SupportedRegion;
  regionName: string;
  currency: string;
  currencySymbol: string;
  telephonyProvider: string;
  city: null;
  plans: FallbackPlan[];
}

export function isSupportedRegion(value?: string | null): value is SupportedRegion {
  return value === "EU" || value === "AR" || value === "AU" || value === "US";
}

export function getRouteRegionOverride(pathname?: string | null): SupportedRegion | null {
  if (!pathname) return null;
  if (pathname === "/es" || pathname.startsWith("/es/")) return "AR";
  if (pathname === "/au" || pathname.startsWith("/au/")) return "AU";
  return null;
}

export function getMarketBasePath(pathname?: string | null): MarketBasePath {
  const region = getRouteRegionOverride(pathname);
  if (region === "AR") return "/es";
  if (region === "AU") return "/au";
  return "/";
}

export function buildMarketPath(basePath: MarketBasePath, path: string): string {
  if (!path) return basePath;

  if (path.startsWith("#")) {
    return basePath === "/" ? path : `${basePath}${path}`;
  }

  if (!path.startsWith("/")) {
    path = `/${path}`;
  }

  if (path === "/") {
    return basePath;
  }

  return basePath === "/" ? path : `${basePath}${path}`;
}

export function getFeaturesPath(basePath: MarketBasePath): string {
  if (basePath === "/es") return "/es/funciones";
  if (basePath === "/au") return "/au/features";
  return "/features";
}

export function getDirectoryPath(basePath: MarketBasePath): string {
  if (basePath === "/es") return "/es/directorio";
  if (basePath === "/au") return "/au/directory";
  return "/directory";
}

export function getUseCasesPath(basePath: MarketBasePath): string {
  if (basePath === "/au") return "/au/for";
  return "/for";
}

export function getBlogPath(basePath: MarketBasePath): string {
  if (basePath === "/es") return "/es/blog";
  if (basePath === "/au") return "/au/blog";
  return "/blog";
}

export function getComparePath(basePath: MarketBasePath): string {
  if (basePath === "/au") return "/au/compare";
  return "/compare";
}

export function getPricingPath(basePath: MarketBasePath): string {
  if (basePath === "/es") return "/es/precios";
  if (basePath === "/au") return "/au/pricing";
  return "/pricing";
}

export function getDemoPath(basePath: MarketBasePath): string {
  if (basePath === "/au") return "/au/demo";
  return "/demo";
}

export function getConnectPath(basePath: MarketBasePath): string {
  if (basePath === "/au") return "/au/connect";
  return "/connect";
}

export function getConnectProviderPath(basePath: MarketBasePath, slug: string): string {
  return `${getConnectPath(basePath)}/${slug}`;
}

export function getReceptionistCityPath(basePath: MarketBasePath, slug: string): string {
  if (basePath === "/au") return `/au/locations/${slug}`;
  return `/ai-receptionist/${slug}`;
}

export function buildLoginPath(planId?: string | null, region?: string | null): string {
  const params = new URLSearchParams();
  if (planId) {
    params.set("plan", planId);
  }
  if (isSupportedRegion(region) && region !== "EU") {
    params.set("region", region);
  }
  const query = params.toString();
  return query ? `/login?${query}` : "/login";
}

export function buildRegisterPath(planId?: string | null, region?: string | null): string {
  const params = new URLSearchParams();
  if (planId) {
    params.set("plan", planId);
  }
  if (isSupportedRegion(region) && region !== "EU") {
    params.set("region", region);
  }
  const query = params.toString();
  return query ? `/register?${query}` : "/register";
}

export function getRegionLabel(region?: string | null): string {
  if (region === "AR") return "Argentina";
  if (region === "AU") return "Australia";
  if (region === "US") return "United States";
  return "Ireland / Europe";
}

export function getPhoneNumberLabel(region?: string | null): string {
  if (region === "AR") return "Argentine phone number";
  if (region === "AU") return "Australian phone number";
  if (region === "US") return "US phone number";
  return "Irish phone number";
}

const FALLBACK_REGION_DATA: Record<SupportedRegion, FallbackRegionData> = {
  EU: {
    region: "EU",
    regionName: "Ireland / Europe",
    currency: "EUR",
    currencySymbol: "\u20AC",
    telephonyProvider: "voipcloud",
    city: null,
    plans: [
      { id: "starter", price: 99, formattedPrice: "\u20AC99", monthlyMinutes: 500, paymentLink: null },
      { id: "growth", price: 299, formattedPrice: "\u20AC299", monthlyMinutes: 1000, paymentLink: null },
      { id: "pro", price: 599, formattedPrice: "\u20AC599", monthlyMinutes: 2000, paymentLink: null },
    ],
  },
  AR: {
    region: "AR",
    regionName: "Argentina",
    currency: "USD",
    currencySymbol: "$",
    telephonyProvider: "voximplant",
    city: null,
    plans: [
      { id: "starter", price: 49, formattedPrice: "$49", monthlyMinutes: 250, paymentLink: null },
      { id: "growth", price: 149, formattedPrice: "$149", monthlyMinutes: 500, paymentLink: null },
      { id: "pro", price: 299, formattedPrice: "$299", monthlyMinutes: 1000, paymentLink: null },
    ],
  },
  US: {
    region: "US",
    regionName: "United States",
    currency: "USD",
    currencySymbol: "$",
    telephonyProvider: "vapi",
    city: null,
    plans: [
      { id: "starter", price: 99, formattedPrice: "$99", monthlyMinutes: 500, paymentLink: null },
      { id: "growth", price: 299, formattedPrice: "$299", monthlyMinutes: 1000, paymentLink: null },
      { id: "pro", price: 599, formattedPrice: "$599", monthlyMinutes: 2000, paymentLink: null },
    ],
  },
  AU: {
    region: "AU",
    regionName: "Australia",
    currency: "AUD",
    currencySymbol: "A$",
    telephonyProvider: "voximplant",
    city: null,
    plans: [
      { id: "starter", price: 140, formattedPrice: "A$140", monthlyMinutes: 500, paymentLink: null },
      { id: "growth", price: 424, formattedPrice: "A$424", monthlyMinutes: 1000, paymentLink: null },
      { id: "pro", price: 851, formattedPrice: "A$851", monthlyMinutes: 2000, paymentLink: null },
    ],
  },
};

export function getFallbackRegionData(region: SupportedRegion = "EU"): FallbackRegionData {
  return FALLBACK_REGION_DATA[region];
}
