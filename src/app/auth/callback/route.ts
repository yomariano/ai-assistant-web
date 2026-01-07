import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Get the base URL, handling reverse proxy environments
function getBaseUrl(request: NextRequest): string {
  // First, check for forwarded headers (set by reverse proxies like Traefik)
  const forwardedHost = request.headers.get('x-forwarded-host');
  const forwardedProto = request.headers.get('x-forwarded-proto') || 'https';

  console.log('[AUTH CALLBACK] getBaseUrl - forwardedHost:', forwardedHost, 'forwardedProto:', forwardedProto);

  if (forwardedHost) {
    const url = `${forwardedProto}://${forwardedHost}`;
    console.log('[AUTH CALLBACK] Using forwarded URL:', url);
    return url;
  }

  // Fallback to configured site URL for production
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    console.log('[AUTH CALLBACK] Using NEXT_PUBLIC_SITE_URL:', process.env.NEXT_PUBLIC_SITE_URL);
    return process.env.NEXT_PUBLIC_SITE_URL;
  }

  // Last resort: use request.url (works for local dev)
  const url = new URL(request.url);
  const baseUrl = `${url.protocol}//${url.host}`;
  console.log('[AUTH CALLBACK] Using request.url fallback:', baseUrl);
  return baseUrl;
}

export async function GET(request: NextRequest) {
  console.log('[AUTH CALLBACK] ====== Auth callback started ======');
  console.log('[AUTH CALLBACK] Request URL:', request.url);

  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const error = requestUrl.searchParams.get('error');
  const errorDescription = requestUrl.searchParams.get('error_description');

  console.log('[AUTH CALLBACK] Code present:', !!code);
  console.log('[AUTH CALLBACK] Error:', error);
  console.log('[AUTH CALLBACK] Error description:', errorDescription);

  if (code) {
    console.log('[AUTH CALLBACK] Exchanging code for session...');
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            console.log('[AUTH CALLBACK] Setting cookies:', cookiesToSet.map(c => c.name));
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              );
            } catch (e) {
              console.error('[AUTH CALLBACK] Cookie set error:', e);
            }
          },
        },
      }
    );

    try {
      const { data, error: sessionError } = await supabase.auth.exchangeCodeForSession(code);
      console.log('[AUTH CALLBACK] Session exchange result:', {
        success: !!data.session,
        userId: data.session?.user?.id,
        email: data.session?.user?.email,
        error: sessionError?.message
      });
    } catch (e) {
      console.error('[AUTH CALLBACK] Session exchange exception:', e);
    }
  }

  // Redirect to dashboard after successful authentication
  const baseUrl = getBaseUrl(request);
  const redirectUrl = new URL('/dashboard', baseUrl);
  console.log('[AUTH CALLBACK] Redirecting to:', redirectUrl.toString());
  console.log('[AUTH CALLBACK] ====== Auth callback completed ======');

  return NextResponse.redirect(redirectUrl);
}
