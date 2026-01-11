'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Phone } from 'lucide-react';
import { useAuthStore } from '@/lib/store';
import Button from '@/components/ui/button';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { loginWithGoogle, devLogin, isAuthenticated, isLoading, checkAuth, token } = useAuthStore();
  const [error, setError] = useState('');
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [isLocalhost, setIsLocalhost] = useState(false);

  // Get the plan from URL if user came from pricing
  const selectedPlan = searchParams.get('plan');

  useEffect(() => {
    // Check if running on localhost
    const hostname = window.location.hostname;
    setIsLocalhost(hostname === 'localhost' || hostname === '127.0.0.1');

    // Store selected plan in sessionStorage for after OAuth redirect
    if (selectedPlan) {
      sessionStorage.setItem('selectedPlan', selectedPlan);
    }

    checkAuth();
  }, [checkAuth, selectedPlan]);

  useEffect(() => {
    const handlePostAuthRedirect = async () => {
      if (!isLoading && isAuthenticated) {
        // Check if user was trying to go somewhere before login
        const redirectPath = sessionStorage.getItem('redirectAfterLogin');
        if (redirectPath) {
          sessionStorage.removeItem('redirectAfterLogin');
          router.push(redirectPath);
          return;
        }

        // Check if user selected a plan from pricing page
        const plan = sessionStorage.getItem('selectedPlan') || selectedPlan;
        if (plan) {
          sessionStorage.removeItem('selectedPlan');
          sessionStorage.removeItem('pendingPaymentLink');

          try {
            // Call the redirect API to determine where to send the user
            // This checks subscription status and returns either:
            // - Payment link URL (new user)
            // - Customer Portal URL (existing subscriber)
            const headers: Record<string, string> = {};
            if (token) {
              headers['Authorization'] = `Bearer ${token}`;
            }

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/billing/redirect?planId=${plan}`, {
              credentials: 'include',
              headers
            });

            if (response.ok) {
              const data = await response.json();
              if (data.url) {
                window.location.href = data.url;
                return;
              }
            }
          } catch (error) {
            console.error('Failed to get redirect URL:', error);
          }

          // Fallback: if redirect API fails, go to dashboard
          router.push('/dashboard');
          return;
        }

        // No plan selected - go to dashboard
        router.push('/dashboard');
      }
    };

    handlePostAuthRedirect();
  }, [isLoading, isAuthenticated, router, selectedPlan, token]);

  const handleGoogleSignIn = async () => {
    setError('');
    setIsSigningIn(true);

    try {
      await loginWithGoogle();
      // Redirect happens automatically via OAuth
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Sign in failed';
      setError(errorMessage);
      setIsSigningIn(false);
    }
  };

  const handleDevLogin = async () => {
    setError('');
    setIsSigningIn(true);

    try {
      await devLogin();
      // The useEffect will handle redirect after isAuthenticated becomes true
      // Just need to trigger a re-check of auth state
      await checkAuth();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Dev login failed';
      setError(errorMessage);
      setIsSigningIn(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 to-indigo-800">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 to-indigo-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
            <Phone className="w-8 h-8 text-purple-600" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">Welcome</h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to your AI Assistant account
          </p>
        </div>

        <div className="mt-8 space-y-6">
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm">
              {error}
            </div>
          )}

          <Button
            type="button"
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center gap-3"
            size="lg"
            variant="outline"
            isLoading={isSigningIn}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Sign in with Google
          </Button>

          {isLocalhost && (
            <>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Localhost Only</span>
                </div>
              </div>

              <Button
                type="button"
                onClick={handleDevLogin}
                className="w-full"
                size="lg"
                variant="secondary"
                isLoading={isSigningIn}
              >
                Dev Login (Bypass Auth)
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 to-indigo-800">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
