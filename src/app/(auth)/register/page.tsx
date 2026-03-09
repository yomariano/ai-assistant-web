'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { getSessionResult, signInWithGoogle } from '@/lib/supabase';
import { buildLoginPath, isSupportedRegion } from '@/lib/market';

export default function RegisterPage() {
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
    const loginRedirect = buildLoginPath(plan, region);

    const startRegistration = async () => {
      if (plan) {
        sessionStorage.setItem('selectedPlan', plan);
      } else {
        sessionStorage.removeItem('selectedPlan');
        sessionStorage.removeItem('pendingPaymentLink');
      }
      if (isSupportedRegion(region)) {
        sessionStorage.setItem('selectedRegion', region);
      }

      const { session } = await getSessionResult({ timeoutMs: 3000 });
      if (session?.access_token) {
        router.replace(loginRedirect);
        return;
      }

      await signInWithGoogle({ next: loginRedirect });
    };

    void startRegistration().catch((error) => {
      console.error('[REGISTER] Failed to start Google OAuth:', error);
      router.replace(loginRedirect);
    });
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 to-indigo-800">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
    </div>
  );
}
