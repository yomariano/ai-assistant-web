import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(request: NextRequest) {
  console.log('[AUTH CALLBACK] ====== Auth callback started ======');
  console.log('[AUTH CALLBACK] Request URL:', request.url);

  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');
  const errorDescription = searchParams.get('error_description');

  // Support "next" parameter for custom redirect paths
  let next = searchParams.get('next') ?? '/dashboard';
  if (!next.startsWith('/')) {
    next = '/dashboard';
  }
  // Add fresh_auth param to indicate we just completed OAuth - dashboard will wait for session
  const separator = next.includes('?') ? '&' : '?';
  next = `${next}${separator}fresh_auth=1`;

  console.log('[AUTH CALLBACK] Code present:', !!code);
  console.log('[AUTH CALLBACK] Error:', error);
  console.log('[AUTH CALLBACK] Error description:', errorDescription);
  console.log('[AUTH CALLBACK] Next path:', next);

  if (error) {
    console.error('[AUTH CALLBACK] OAuth error:', error, errorDescription);
    // Redirect to login with error
    return NextResponse.redirect(new URL(`/login?error=${encodeURIComponent(error)}`, origin));
  }

  if (code) {
    console.log('[AUTH CALLBACK] Exchanging code for session...');
    const supabase = await createClient();

    const { data, error: sessionError } = await supabase.auth.exchangeCodeForSession(code);

    console.log('[AUTH CALLBACK] Session exchange result:', {
      success: !!data.session,
      userId: data.session?.user?.id,
      email: data.session?.user?.email,
      error: sessionError?.message
    });

    if (sessionError) {
      console.error('[AUTH CALLBACK] Session exchange failed:', sessionError);
      return NextResponse.redirect(new URL(`/login?error=${encodeURIComponent(sessionError.message)}`, origin));
    }

    // Handle reverse proxy environments (Traefik, etc.)
    const forwardedHost = request.headers.get('x-forwarded-host');
    const isLocalEnv = process.env.NODE_ENV === 'development';

    console.log('[AUTH CALLBACK] forwardedHost:', forwardedHost);
    console.log('[AUTH CALLBACK] isLocalEnv:', isLocalEnv);

    if (isLocalEnv) {
      // In local dev, no load balancer, use origin directly
      console.log('[AUTH CALLBACK] Local env - redirecting to:', `${origin}${next}`);
      return NextResponse.redirect(new URL(next, origin));
    } else if (forwardedHost) {
      // Behind reverse proxy - use forwarded host
      const forwardedProto = request.headers.get('x-forwarded-proto') || 'https';
      const redirectUrl = `${forwardedProto}://${forwardedHost}${next}`;
      console.log('[AUTH CALLBACK] Reverse proxy - redirecting to:', redirectUrl);
      return NextResponse.redirect(new URL(redirectUrl));
    } else if (process.env.NEXT_PUBLIC_SITE_URL) {
      // Fallback to configured site URL
      const redirectUrl = `${process.env.NEXT_PUBLIC_SITE_URL}${next}`;
      console.log('[AUTH CALLBACK] Using SITE_URL - redirecting to:', redirectUrl);
      return NextResponse.redirect(new URL(redirectUrl));
    } else {
      // Last resort - use origin
      console.log('[AUTH CALLBACK] Fallback - redirecting to:', `${origin}${next}`);
      return NextResponse.redirect(new URL(next, origin));
    }
  }

  // No code provided - redirect to login
  console.log('[AUTH CALLBACK] No code provided, redirecting to login');
  return NextResponse.redirect(new URL('/login', origin));
}
