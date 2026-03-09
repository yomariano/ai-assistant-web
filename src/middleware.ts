import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { buildWaitlistPath, isSupportedCountryCode, normalizeCountryCode } from '@/lib/country-access';

const BLOG_DUPLICATE_SUFFIX = /^(.+?)-([2-9]|[1-9]\d)$/;
const BLOG_DUPLICATE_SEGMENT = /^(.+?)\/-([2-9]|[1-9]\d)$/;
const DEFAULT_API_URL = 'https://api.voicefleet.ai';
const COUNTRY_GATED_PATHS = [
  '/login',
  '/register',
  '/checkout',
  '/dashboard',
  '/assistant',
  '/billing',
  '/call',
  '/history',
  '/integrations',
  '/knowledge-gaps',
  '/notifications',
  '/scheduled',
  '/settings',
  '/agenda',
  '/admin',
];

function getApiUrl(): string {
  return (process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || DEFAULT_API_URL).replace(/\/+$/, '');
}

function getRequestCountryCode(request: NextRequest): string | null {
  return normalizeCountryCode(
    request.headers.get('x-vercel-ip-country') ||
    request.headers.get('cf-ipcountry') ||
    request.headers.get('x-country-code')
  );
}

function isLocallyBypassedHost(hostname: string): boolean {
  return (
    hostname === 'localhost' ||
    hostname === '127.0.0.1' ||
    hostname === 'dev-app.voicefleet.ai' ||
    hostname.includes('dev-')
  );
}

function isCountryGatedPath(pathname: string): boolean {
  return COUNTRY_GATED_PATHS.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

function getMarketRedirectPath(request: NextRequest): '/es' | '/au' | null {
  const countryCode = getRequestCountryCode(request) || '';

  if (countryCode === 'AR') return '/es';
  if (countryCode === 'AU') return '/au';
  return null;
}

function getCanonicalBlogPath(pathname: string): { currentSlug: string; canonicalPath: string; canonicalSlug: string; language?: string } | null {
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
        language: prefix === '/es/blog/' ? 'es' : 'en',
      };
    }

    const segmentMatch = slug.match(BLOG_DUPLICATE_SEGMENT);
    if (segmentMatch?.[1]) {
      return {
        currentSlug: slug,
        canonicalPath: `${prefix}${segmentMatch[1]}`,
        canonicalSlug: segmentMatch[1],
        language: prefix === '/es/blog/' ? 'es' : 'en',
      };
    }
  }

  return null;
}

async function blogPostExists(slug: string, language?: string): Promise<boolean> {
  const params = new URLSearchParams();
  if (language) {
    params.set('language', language);
  }

  const response = await fetch(`${getApiUrl()}/api/content/blog/${encodeURIComponent(slug)}${params.toString() ? `?${params.toString()}` : ''}`, {
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
  if (
    !isLocallyBypassedHost(request.nextUrl.hostname) &&
    request.nextUrl.pathname !== '/waitlist' &&
    isCountryGatedPath(request.nextUrl.pathname)
  ) {
    const countryCode = getRequestCountryCode(request);

    if (countryCode && !isSupportedCountryCode(countryCode)) {
      const redirectUrl = request.nextUrl.clone();
      const from = `${request.nextUrl.pathname}${request.nextUrl.search}`;

      redirectUrl.pathname = '/waitlist';
      redirectUrl.search = buildWaitlistPath(countryCode, from).replace('/waitlist', '');

      return NextResponse.redirect(redirectUrl, 307);
    }
  }

  if (request.nextUrl.pathname === '/') {
    const marketRedirectPath = getMarketRedirectPath(request);
    if (marketRedirectPath) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = marketRedirectPath;
      return NextResponse.redirect(redirectUrl, 307);
    }
  }

  const duplicateBlogPath = getCanonicalBlogPath(request.nextUrl.pathname);

  if (duplicateBlogPath) {
    const duplicateExists = !duplicateBlogPath.currentSlug.includes('/')
      ? await blogPostExists(duplicateBlogPath.currentSlug, duplicateBlogPath.language)
      : false;
    const canonicalExists = await blogPostExists(duplicateBlogPath.canonicalSlug, duplicateBlogPath.language);

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
