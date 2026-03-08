import type { NextRequest } from "next/server";

import { getBusinessesBySlug, type Business } from "@/lib/directory-data";
import { getSupabaseAdminClient } from "@/lib/supabase-admin";

export type DirectoryClickType = "website" | "phone";

interface ResolveTrackedBusinessInput {
  slug: string;
  vertical?: string | null;
  citySlug?: string | null;
  referer?: string | null;
}

interface DirectoryRefererContext {
  vertical?: string;
  citySlug?: string;
}

const ABSOLUTE_URL_PATTERN = /^[a-zA-Z][a-zA-Z\d+\-.]*:/;

export function buildTrackedDirectoryPath(
  basePath: "go" | "call",
  business: Pick<Business, "slug" | "vertical" | "citySlug">
) {
  const searchParams = new URLSearchParams({
    vertical: business.vertical,
    city: business.citySlug,
  });

  return `/${basePath}/${business.slug}?${searchParams.toString()}`;
}

export function buildDirectoryListingPath(
  business: Pick<Business, "slug" | "vertical" | "citySlug">
) {
  return `/directory/${business.vertical}/${business.citySlug}/${business.slug}`;
}

export function getDirectoryFallbackPath(referer?: string | null) {
  if (!referer) {
    return "/directory";
  }

  try {
    const pathname = new URL(referer).pathname;
    return pathname.startsWith("/es/directorio") ? "/es/directorio" : "/directory";
  } catch {
    return "/directory";
  }
}

export function resolveTrackedBusiness({
  slug,
  vertical,
  citySlug,
  referer,
}: ResolveTrackedBusinessInput) {
  const matches = getBusinessesBySlug(slug);

  if (!matches.length) {
    return null;
  }

  const refererContext = getDirectoryContextFromReferer(referer, slug);
  const effectiveVertical = vertical?.trim() || refererContext?.vertical;
  const effectiveCitySlug = citySlug?.trim() || refererContext?.citySlug;

  let narrowedMatches = matches;

  if (effectiveVertical) {
    narrowedMatches = narrowedMatches.filter(
      (business) => business.vertical === effectiveVertical
    );
  }

  if (effectiveCitySlug) {
    narrowedMatches = narrowedMatches.filter(
      (business) => business.citySlug === effectiveCitySlug
    );
  }

  if (narrowedMatches.length === 1) {
    return narrowedMatches[0];
  }

  return matches.length === 1 ? matches[0] : null;
}

export function buildTrackedWebsiteUrl(business: Pick<Business, "website" | "citySlug" | "vertical" | "slug">) {
  const destination = normalizeWebsiteUrl(business.website);

  if (!destination) {
    return null;
  }

  destination.searchParams.set("utm_source", "voicefleet");
  destination.searchParams.set("utm_medium", "directory");
  destination.searchParams.set(
    "utm_campaign",
    `${business.citySlug}-${business.vertical}`
  );
  destination.searchParams.set("utm_content", business.slug);

  return destination;
}

export function buildTelephoneUri(phone: string) {
  const trimmedPhone = phone.trim();

  if (!trimmedPhone) {
    return null;
  }

  const normalizedPhone = trimmedPhone.startsWith("+")
    ? `+${trimmedPhone.slice(1).replace(/\D/g, "")}`
    : trimmedPhone.replace(/\D/g, "");

  return `tel:${normalizedPhone || trimmedPhone}`;
}

export async function logDirectoryClick({
  request,
  business,
  clickType,
}: {
  request: NextRequest;
  business: Pick<Business, "slug" | "name" | "vertical" | "city" | "citySlug">;
  clickType: DirectoryClickType;
}) {
  const supabase = getSupabaseAdminClient();

  if (!supabase) {
    console.warn(
      "[directory-tracking] Missing Supabase admin credentials. Skipping click log."
    );
    return;
  }

  const { error } = await supabase.from("directory_clicks").insert({
    business_slug: business.slug,
    business_name: business.name,
    vertical: business.vertical,
    city: business.city,
    city_slug: business.citySlug,
    referrer: request.headers.get("referer") || null,
    user_agent: request.headers.get("user-agent") || null,
    ip_country: getRequestCountry(request),
    click_type: clickType,
    clicked_at: new Date().toISOString(),
  });

  if (error) {
    console.error("[directory-tracking] Failed to insert directory click", error);
  }
}

function normalizeWebsiteUrl(website: string) {
  const trimmedWebsite = website.trim();

  if (!trimmedWebsite) {
    return null;
  }

  const candidate = ABSOLUTE_URL_PATTERN.test(trimmedWebsite)
    ? trimmedWebsite
    : `https://${trimmedWebsite}`;

  try {
    return new URL(candidate);
  } catch {
    return null;
  }
}

function getRequestCountry(request: NextRequest) {
  return (
    request.headers.get("x-vercel-ip-country") ||
    request.headers.get("cf-ipcountry") ||
    request.headers.get("x-country-code") ||
    null
  );
}

function getDirectoryContextFromReferer(
  referer: string | null | undefined,
  slug: string
): DirectoryRefererContext | null {
  if (!referer) {
    return null;
  }

  try {
    const pathname = new URL(referer).pathname;
    const segments = pathname.split("/").filter(Boolean);

    if (
      segments[0] === "directory" &&
      segments.length >= 4 &&
      segments[3] === slug
    ) {
      return {
        vertical: segments[1],
        citySlug: segments[2],
      };
    }

    if (
      segments[0] === "es" &&
      segments[1] === "directorio" &&
      segments.length >= 5 &&
      segments[4] === slug
    ) {
      return {
        citySlug: segments[3],
      };
    }

    return null;
  } catch {
    return null;
  }
}
