import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const BLOG_DUPLICATE_SUFFIX = /^(.+?)-([2-9]|[1-9]\d)$/;
const BLOG_DUPLICATE_SEGMENT = /^(.+?)\/-([2-9]|[1-9]\d)$/;
const DEFAULT_API_URL = 'https://api.voicefleet.ai';

function getApiUrl(): string {
  return (process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || DEFAULT_API_URL).replace(/\/+$/, '');
}

function getCanonicalBlogPath(pathname: string): { currentSlug: string; canonicalPath: string; canonicalSlug: string } | null {
  const blogPrefixes = ['/blog/', '/es/blog/'];

  for (const prefix of blogPrefixes) {
    if (!pathname.startsWith(prefix)) {
      continue;
    }

    const slug = pathname.slice(prefix.length).replace(/\/+$/, '');
    if (!slug) {
      return null;
    }

    const suffixMatch = slug.match(BLOG_DUPLICATE_SUFFIX);
    if (suffixMatch?.[1]) {
      return {
        currentSlug: slug,
        canonicalPath: `${prefix}${suffixMatch[1]}`,
        canonicalSlug: suffixMatch[1],
      };
    }

    const segmentMatch = slug.match(BLOG_DUPLICATE_SEGMENT);
    if (segmentMatch?.[1]) {
      return {
        currentSlug: slug,
        canonicalPath: `${prefix}${segmentMatch[1]}`,
        canonicalSlug: segmentMatch[1],
      };
    }
  }

  return null;
}

async function blogPostExists(slug: string): Promise<boolean> {
  const response = await fetch(`${getApiUrl()}/api/content/blog/${encodeURIComponent(slug)}`, {
    cache: 'no-store',
    headers: {
      Accept: 'application/json',
    },
  });

  return response.ok;
}

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
export async function middleware(request: NextRequest) {
  const duplicateBlogPath = getCanonicalBlogPath(request.nextUrl.pathname);

  if (duplicateBlogPath) {
    const duplicateExists = !duplicateBlogPath.currentSlug.includes('/')
      ? await blogPostExists(duplicateBlogPath.currentSlug)
      : false;
    const canonicalExists = await blogPostExists(duplicateBlogPath.canonicalSlug);

    if (!duplicateExists && canonicalExists) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = duplicateBlogPath.canonicalPath;

      return NextResponse.redirect(redirectUrl, 301);
    }
  }

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
