'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { getSessionResult, signInWithGoogle } from '@/lib/supabase';

const DEFAULT_TRIAL_PLAN = 'starter';

export default function RegisterPage() {
  const router = useRouter();
  const hasStarted = useRef(false);

  useEffect(() => {
    if (hasStarted.current) {
      return;
    }

    hasStarted.current = true;

    const params = new URLSearchParams(window.location.search);
    const plan = params.get('plan') || DEFAULT_TRIAL_PLAN;
    const loginRedirect = `/login?plan=${encodeURIComponent(plan)}`;

    const startRegistration = async () => {
      sessionStorage.setItem('selectedPlan', plan);

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
