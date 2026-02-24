import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Middleware to prevent browser caching of HTML/RSC responses.
 *
 * After Coolify deployments, browsers served cached HTML which referenced
 * old JS bundles with outdated pricing and deactivated payment links.
 * This middleware ensures browsers always fetch fresh HTML, which then
 * references the correct content-hashed JS chunks from the new build.
 *
 * Note: Next.js middleware does NOT run for _next/static/* paths by default,
 * so hashed JS/CSS bundles keep their immutable cache headers.
 */
export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
  response.headers.set('Pragma', 'no-cache');

  return response;
}

export const config = {
  // Match all paths except static files and images
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff|woff2|ttf|eot)).*)',
  ],
};
