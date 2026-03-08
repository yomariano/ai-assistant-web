import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import {
  buildTelephoneUri,
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

  if (!business?.phone) {
    return NextResponse.redirect(
      new URL(getDirectoryFallbackPath(request.headers.get("referer")), request.url),
      302
    );
  }

  const phoneUri = buildTelephoneUri(business.phone);

  if (!phoneUri) {
    return NextResponse.redirect(
      new URL(getDirectoryFallbackPath(request.headers.get("referer")), request.url),
      302
    );
  }

  await logDirectoryClick({
    request,
    business,
    clickType: "phone",
  });

  return new NextResponse(null, {
    status: 302,
    headers: {
      Location: phoneUri,
      "Cache-Control": "no-store",
      "X-Robots-Tag": "noindex, nofollow",
    },
  });
}
