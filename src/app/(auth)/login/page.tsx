'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { getSessionResult, signInWithGoogle } from '@/lib/supabase';
import { isSupportedRegion } from '@/lib/market';

export default function LoginPage() {
  const router = useRouter();
  const hasStarted = useRef(false);

  useEffect(() => {
    if (hasStarted.current) {
      return;
    }

    hasStarted.current = true;

    const params = new URLSearchParams(window.location.search);
    const plan = params.get('plan');
    const region = params.get('region');

    const startLogin = async () => {
      // Save plan/region for DashboardLayout to pick up after auth
      if (plan) {
        sessionStorage.setItem('selectedPlan', plan);
      }
      if (isSupportedRegion(region)) {
        sessionStorage.setItem('selectedRegion', region);
      }

      // Dev environment: go straight to dashboard (dev login handled by DashboardLayout)
      const isDevEnvironment =
        window.location.hostname === 'localhost' ||
        window.location.hostname === '127.0.0.1' ||
        window.location.hostname === 'dev-app.voicefleet.ai' ||
        window.location.hostname.includes('dev-');

      if (isDevEnvironment) {
        router.replace('/dashboard');
        return;
      }

      // Check for existing session
      const { session } = await getSessionResult({ timeoutMs: 3000 });
      if (session?.access_token) {
        router.replace('/dashboard');
        return;
      }

      // No session — trigger Google OAuth
      await signInWithGoogle({ next: '/dashboard' });
    };

    void startLogin().catch((error) => {
      console.error('[LOGIN] Failed to start Google OAuth:', error);
      router.replace('/?auth_error=signin_failed');
    });
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 to-indigo-800">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
    </div>
  );
}
