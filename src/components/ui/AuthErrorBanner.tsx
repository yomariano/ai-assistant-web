'use client';

import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { X } from 'lucide-react';

const ERROR_MESSAGES: Record<string, string> = {
  signin_failed: 'Sign in failed. Please try again.',
  register_failed: 'Registration failed. Please try again.',
  access_denied: 'Access was denied. Please try again.',
};

export default function AuthErrorBanner() {
  const searchParams = useSearchParams();
  const [dismissed, setDismissed] = useState(false);

  const authError = searchParams.get('auth_error');
  const errorMessage = useMemo(
    () => authError ? (ERROR_MESSAGES[authError] || `Authentication error: ${authError}`) : null,
    [authError]
  );

  // Clean auth_error from URL without triggering re-render
  useEffect(() => {
    if (authError) {
      const url = new URL(window.location.href);
      url.searchParams.delete('auth_error');
      window.history.replaceState({}, '', url.pathname + (url.search || ''));
    }
  }, [authError]);

  if (!errorMessage || dismissed) return null;

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 max-w-md w-full px-4">
      <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 flex items-center gap-3 shadow-lg">
        <p className="text-sm flex-1">{errorMessage}</p>
        <button
          onClick={() => setDismissed(true)}
          className="shrink-0 p-1 hover:bg-red-100 rounded transition-colors"
          aria-label="Dismiss"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
