import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import {
  buildTrackedWebsiteUrl,
  getDirectoryFallbackPath,
  logDirectoryClick,
  resolveTrackedBusiness,
} from "@/lib/directory-tracking";

export const dynamic = "force-dynamic";

interface RouteContext {
  params: Promise<{ slug: string }>;
}

export async function GET(request: NextRequest, { params }: RouteContext) {
  const { slug } = await params;
  const searchParams = request.nextUrl.searchParams;
  const business = await resolveTrackedBusiness({
    slug,
    vertical: searchParams.get("vertical"),
    citySlug: searchParams.get("city"),
    referer: request.headers.get("referer"),
  });

  if (!business) {
    return NextResponse.redirect(
      new URL(getDirectoryFallbackPath(request.headers.get("referer")), request.url),
      302
    );
  }

  const destination = buildTrackedWebsiteUrl(business);

  if (!destination) {
    return NextResponse.redirect(
      new URL(getDirectoryFallbackPath(request.headers.get("referer")), request.url),
      302
    );
  }

  await logDirectoryClick({
    request,
    business,
    clickType: "website",
  });

  const response = NextResponse.redirect(destination, 302);
  response.headers.set("Cache-Control", "no-store");
  response.headers.set("X-Robots-Tag", "noindex, nofollow");
  return response;
}
