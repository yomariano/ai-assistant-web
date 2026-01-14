'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { providersApi } from '@/lib/api';

export default function OAuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [error, setError] = useState('');

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get('code');
      const state = searchParams.get('state');
      const errorParam = searchParams.get('error');

      if (errorParam) {
        setStatus('error');
        setError(searchParams.get('error_description') || 'Authorization was denied');
        return;
      }

      if (!code || !state) {
        setStatus('error');
        setError('Missing authorization code or state');
        return;
      }

      try {
        // Parse state to get provider ID
        const stateData = JSON.parse(atob(state));
        const providerId = stateData.providerId;

        if (!providerId) {
          throw new Error('Invalid state: missing provider ID');
        }

        // Exchange code for tokens
        const redirectUri = `${window.location.origin}/integrations/providers/oauth/callback`;
        await providersApi.handleOAuthCallback(providerId, code, state, redirectUri);

        setStatus('success');

        // Redirect back to providers page after a brief delay
        setTimeout(() => {
          router.push('/integrations/providers');
        }, 2000);
      } catch (err: unknown) {
        console.error('OAuth callback error:', err);
        setStatus('error');
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        setError(`Failed to complete authorization: ${errorMessage}`);
      }
    };

    handleCallback();
  }, [searchParams, router]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center max-w-md mx-auto p-8">
        {status === 'loading' && (
          <>
            <Loader2 className="w-16 h-16 text-primary animate-spin mx-auto mb-4" />
            <h1 className="text-xl font-semibold text-slate-900 mb-2">Completing Authorization</h1>
            <p className="text-slate-500">Please wait while we connect your account...</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-10 h-10 text-emerald-600" />
            </div>
            <h1 className="text-xl font-semibold text-slate-900 mb-2">Successfully Connected!</h1>
            <p className="text-slate-500">Your booking provider has been connected. Redirecting...</p>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <XCircle className="w-10 h-10 text-rose-600" />
            </div>
            <h1 className="text-xl font-semibold text-slate-900 mb-2">Connection Failed</h1>
            <p className="text-slate-500 mb-4">{error}</p>
            <button
              onClick={() => router.push('/integrations/providers')}
              className="text-primary hover:underline font-medium"
            >
              Return to Providers
            </button>
          </>
        )}
      </div>
    </div>
  );
}
