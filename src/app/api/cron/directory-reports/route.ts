import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { buildDirectoryListingPath } from "@/lib/directory-tracking";
import { requireSupabaseAdminClient } from "@/lib/supabase-admin";

export const dynamic = "force-dynamic";

interface DirectoryClickRow {
  business_slug: string;
  business_name: string | null;
  vertical: string | null;
  city: string | null;
  city_slug: string | null;
  click_type: "website" | "phone" | null;
}

interface BusinessClickSummary {
  slug: string;
  name: string;
  vertical: string;
  city: string;
  citySlug: string;
  websiteClicks: number;
  phoneClicks: number;
  totalClicks: number;
  directoryUrl: string;
}

export async function GET(request: NextRequest) {
  const secret = process.env.DIRECTORY_REPORTS_CRON_SECRET || process.env.CRON_SECRET;
  const authorizationHeader = request.headers.get("authorization");

  if (secret && authorizationHeader !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = requireSupabaseAdminClient();
  const startOfThisMonth = new Date(
    Date.UTC(new Date().getUTCFullYear(), new Date().getUTCMonth(), 1)
  );
  const startOfLastMonth = new Date(
    Date.UTC(startOfThisMonth.getUTCFullYear(), startOfThisMonth.getUTCMonth() - 1, 1)
  );

  const { data: clicks, error } = await supabase
    .from("directory_clicks")
    .select("business_slug,business_name,vertical,city,city_slug,click_type")
    .gte("clicked_at", startOfLastMonth.toISOString())
    .lt("clicked_at", startOfThisMonth.toISOString())
    .returns<DirectoryClickRow[]>();

  if (error) {
    console.error("[directory-reports] Failed to load directory clicks", error);
    return NextResponse.json(
      { error: "Failed to load directory clicks" },
      { status: 500 }
    );
  }

  const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://voicefleet.ai").replace(
    /\/+$/,
    ""
  );
  const grouped = new Map<string, BusinessClickSummary>();

  for (const click of clicks || []) {
    const vertical = click.vertical || "unknown";
    const citySlug = click.city_slug || "unknown";
    const key = [click.business_slug, vertical, citySlug].join("::");

    if (!grouped.has(key)) {
      grouped.set(key, {
        slug: click.business_slug,
        name: click.business_name || click.business_slug,
        vertical,
        city: click.city || "Unknown",
        citySlug,
        websiteClicks: 0,
        phoneClicks: 0,
        totalClicks: 0,
        directoryUrl:
          baseUrl +
          buildDirectoryListingPath({
            slug: click.business_slug,
            vertical,
            citySlug,
          }),
      });
    }

    const summary = grouped.get(key);

    if (!summary) {
      continue;
    }

    summary.totalClicks += 1;

    if (click.click_type === "phone") {
      summary.phoneClicks += 1;
    } else {
      summary.websiteClicks += 1;
    }
  }

  const summaries = [...grouped.values()].sort(
    (left, right) => right.totalClicks - left.totalClicks
  );
  const csvLines = [
    "business_name,vertical,city,total_clicks,website_clicks,phone_clicks,directory_url",
    ...summaries.map((summary) =>
      [
        escapeCsv(summary.name),
        escapeCsv(summary.vertical),
        escapeCsv(summary.city),
        summary.totalClicks,
        summary.websiteClicks,
        summary.phoneClicks,
        escapeCsv(summary.directoryUrl),
      ].join(",")
    ),
  ];

  return NextResponse.json({
    month: startOfLastMonth.toISOString().slice(0, 7),
    totalClicks: clicks?.length || 0,
    uniqueBusinesses: summaries.length,
    topBusinesses: summaries.slice(0, 20),
    csv: csvLines.join("\n"),
  });
}

function escapeCsv(value: string) {
  if (/[",\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }

  return value;
}
