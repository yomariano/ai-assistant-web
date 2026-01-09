'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Loader2, AlertCircle } from 'lucide-react';
import { billingApi } from '@/lib/api';

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const planId = searchParams.get('plan');

  useEffect(() => {
    async function redirectToStripe() {
      if (!planId) {
        setError('No plan selected. Please choose a plan first.');
        setIsLoading(false);
        return;
      }

      // Validate plan ID
      if (!['starter', 'growth', 'scale'].includes(planId)) {
        setError('Invalid plan selected. Please choose a valid plan.');
        setIsLoading(false);
        return;
      }

      try {
        // Get the payment link from the API
        const { url } = await billingApi.getPaymentLink(planId);

        if (url) {
          // Redirect to Stripe checkout
          window.location.href = url;
        } else {
          setError('Failed to get payment link. Please try again.');
          setIsLoading(false);
        }
      } catch (err: unknown) {
        console.error('Checkout error:', err);

        // Check for specific error messages
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';

        // Handle "already has subscription" error
        if (errorMessage.includes('already have an active subscription')) {
          router.push('/billing');
          return;
        }

        setError('Failed to start checkout. Please try again or contact support.');
        setIsLoading(false);
      }
    }

    redirectToStripe();
  }, [planId, router]);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
        <h2 className="text-xl font-semibold text-slate-900 mb-2">
          Setting up your checkout...
        </h2>
        <p className="text-slate-500">
          You'll be redirected to our secure payment page.
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <div className="max-w-md text-center">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-semibold text-slate-900 mb-2">
            Checkout Error
          </h2>
          <p className="text-slate-500 mb-6">
            {error}
          </p>
          <div className="space-x-4">
            <button
              onClick={() => router.push('/#pricing')}
              className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition"
            >
              View Plans
            </button>
            <button
              onClick={() => router.push('/billing')}
              className="px-6 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition"
            >
              Go to Billing
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
        <h2 className="text-xl font-semibold text-slate-900 mb-2">
          Loading checkout...
        </h2>
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  );
}
