'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Phone } from 'lucide-react';
import { useAuthStore } from '@/lib/store';
import Button from '@/components/ui/button';

export default function LoginPage() {
  const router = useRouter();
  const { loginWithGoogle, devLogin, isAuthenticated, isLoading, checkAuth } = useAuthStore();
  const [error, setError] = useState('');
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [isLocalhost, setIsLocalhost] = useState(false);

  useEffect(() => {
    // Check if running on localhost
    const hostname = window.location.hostname;
    setIsLocalhost(hostname === 'localhost' || hostname === '127.0.0.1');
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isLoading, isAuthenticated, router]);

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
      router.push('/dashboard');
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
