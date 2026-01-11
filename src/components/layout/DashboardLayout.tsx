'use client';

import { useEffect, useState, useCallback } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import DevUserSwitcher from '@/components/dev/DevUserSwitcher';
import { OnboardingTour, type OnboardingData } from '@/components/onboarding';
import { userApi, billingApi, assistantApi } from '@/lib/api';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, isLoading, checkAuth, devMode, user } = useAuthStore();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Subscription state
  const [hasSubscription, setHasSubscription] = useState<boolean | null>(null);
  const [subscriptionChecked, setSubscriptionChecked] = useState(false);

  // Onboarding state
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [onboardingData, setOnboardingData] = useState<OnboardingData | null>(null);
  const [onboardingChecked, setOnboardingChecked] = useState(false);

  const openPaywallOnboarding = useCallback(() => {
    setOnboardingData({
      userId: user?.id || '',
      userName: user?.fullName?.split(' ')[0] || user?.email?.split('@')[0],
      phoneNumbers: [{ number: '+353 1 234 5678', label: 'Primary (Demo)' }],
      hasExistingAssistant: false,
    });
    setShowOnboarding(true);
  }, [user]);

  const isCheckoutRoute = pathname === '/checkout';
  const isDashboardRoute = pathname === '/dashboard';

  const refreshSubscription = useCallback(async () => {
    setSubscriptionChecked(false);
    setHasSubscription(null);
  }, []);

  useEffect(() => {
    // Auto-refresh subscription after returning from Stripe.
    // Stripe Payment Links may redirect back before webhooks finish writing to `user_subscriptions`,
    // so we poll for a short window and then clear the flag.
    if (!isDashboardRoute) return;
    if (devMode) return;
    if (!isAuthenticated || isLoading) return;

    const raw =
      typeof window !== 'undefined'
        ? window.sessionStorage.getItem('postCheckoutSubscriptionRefresh')
        : null;
    if (!raw) return;

    let startedAt = 0;
    try {
      const parsed = JSON.parse(raw) as { startedAt?: number };
      startedAt = typeof parsed?.startedAt === 'number' ? parsed.startedAt : 0;
    } catch {
      // ignore parse errors
    }

    // If it's stale, clear it and stop.
    if (!startedAt || Date.now() - startedAt > 15 * 60 * 1000) {
      try {
        window.sessionStorage.removeItem('postCheckoutSubscriptionRefresh');
      } catch {
        // ignore
      }
      return;
    }

    let isCancelled = false;

    const sleep = async (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

    const poll = async () => {
      // Up to ~30s total
      for (let attempt = 0; attempt < 15; attempt += 1) {
        if (isCancelled) return;

        try {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const subscriptionResponse: any = await billingApi.getSubscription();
          const subscription =
            subscriptionResponse && typeof subscriptionResponse === 'object' && 'subscription' in subscriptionResponse
              ? subscriptionResponse.subscription
              : subscriptionResponse;

          const isActive =
            subscription && (subscription.status === 'active' || subscription.status === 'trialing');

          setHasSubscription(!!isActive);
          setSubscriptionChecked(true);

          if (isActive) {
            try {
              window.sessionStorage.removeItem('postCheckoutSubscriptionRefresh');
            } catch {
              // ignore
            }
            return;
          }
        } catch (e) {
          console.warn('[DASHBOARD] Post-checkout subscription poll failed:', e);
        }

        await sleep(2000);
      }
    };

    void poll();

    return () => {
      isCancelled = true;
    };
  }, [isDashboardRoute, devMode, isAuthenticated, isLoading]);

  console.log('[DASHBOARD] ====== DashboardLayout render ======');
  console.log('[DASHBOARD] State:', { isLoading, isAuthenticated, devMode, userEmail: user?.email, hasSubscription });

  const toggleSidebar = useCallback(() => setIsSidebarOpen(prev => !prev), []);
  const closeSidebar = useCallback(() => setIsSidebarOpen(false), []);

  useEffect(() => {
    console.log('[DASHBOARD] useEffect - calling checkAuth()');
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    console.log('[DASHBOARD] useEffect - auth state changed:', { isLoading, isAuthenticated });
    if (!isLoading && !isAuthenticated) {
      // Store the intended destination if coming from checkout
      const currentPath = window.location.pathname + window.location.search;
      if (currentPath.startsWith('/checkout')) {
        sessionStorage.setItem('redirectAfterLogin', currentPath);
      }
      console.log('[DASHBOARD] Not authenticated, redirecting to landing page');
      router.push('/');
    }
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    // Allow other pages (billing/assistant/etc.) to send the user to the in-dashboard paywall.
    const shouldShowPaywall =
      typeof window !== 'undefined' &&
      new URLSearchParams(window.location.search).get('paywall') === '1';
    if (!shouldShowPaywall) return;
    if (isLoading || !isAuthenticated) return;
    if (isCheckoutRoute) return;

    console.log('[DASHBOARD] paywall=1 detected - opening onboarding paywall');
    openPaywallOnboarding();
  }, [isLoading, isAuthenticated, openPaywallOnboarding, isCheckoutRoute]);

  // Check subscription status after authentication
  useEffect(() => {
    const checkSubscription = async () => {
      console.log('[DASHBOARD] checkSubscription called:', { isAuthenticated, isLoading, subscriptionChecked, devMode });
      if (!isAuthenticated || isLoading || subscriptionChecked) return;

      // Skip subscription check in dev mode
      if (devMode) {
        console.log('[DASHBOARD] Dev mode - skipping subscription check');
        setHasSubscription(true);
        setSubscriptionChecked(true);
        return;
      }

      try {
        console.log('[DASHBOARD] Checking subscription status...');
        // API returns subscription fields at the top-level (not nested under `subscription`).
        // Keep backward-compat in case response shape changes.
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const subscriptionResponse: any = await billingApi.getSubscription();
        const subscription =
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          subscriptionResponse && typeof subscriptionResponse === 'object' && 'subscription' in subscriptionResponse
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            ? subscriptionResponse.subscription
            : subscriptionResponse;
        console.log('[DASHBOARD] Subscription data:', subscription);

        const isActive = subscription &&
          (subscription.status === 'active' || subscription.status === 'trialing');

        setHasSubscription(isActive);
        setSubscriptionChecked(true);

        if (!isActive) {
          if (!isCheckoutRoute) {
            console.log('[DASHBOARD] No active subscription - opening onboarding paywall');
            openPaywallOnboarding();
          }
        }
      } catch (error) {
        console.error('[DASHBOARD] Failed to check subscription:', error);
        // On error, open onboarding paywall (safer than bouncing to landing)
        setHasSubscription(false);
        setSubscriptionChecked(true);
        if (!isCheckoutRoute) {
          openPaywallOnboarding();
        }
      }
    };

    checkSubscription();
  }, [isAuthenticated, isLoading, subscriptionChecked, devMode, openPaywallOnboarding, isCheckoutRoute]);

  // Check onboarding status after authentication and subscription verification
  useEffect(() => {
    const checkOnboarding = async () => {
      console.log('[DASHBOARD] checkOnboarding called:', { isAuthenticated, isLoading, onboardingChecked, hasSubscription });
      // Wait for subscription check to complete and only proceed if user has subscription
      if (!isAuthenticated || isLoading || onboardingChecked || !hasSubscription) return;

      try {
        console.log('[DASHBOARD] Checking onboarding status...');
        const status = await userApi.getOnboarding();
        console.log('[DASHBOARD] Onboarding status received:', status);

        if (!status.completed) {
          console.log('[DASHBOARD] Onboarding not completed, fetching data...');

          // Fetch phone numbers and assistant info in parallel
          const [phoneData, assistantData] = await Promise.all([
            billingApi.getPhoneNumbers().catch(() => ({ numbers: [], count: 0, maxAllowed: 1, canAddMore: true })),
            assistantApi.get().catch(() => ({ exists: false })),
          ]);

          const data: OnboardingData = {
            userId: user?.id || '',
            userName: user?.fullName?.split(' ')[0] || user?.email?.split('@')[0],
            phoneNumbers: phoneData.numbers.length > 0
              ? phoneData.numbers.map((p: { phone_number?: string; phoneNumber?: string; label?: string }) => ({
                  number: p.phone_number || p.phoneNumber || '',
                  label: p.label || 'Primary',
                }))
              : [{ number: '+353 1 234 5678', label: 'Primary (Demo)' }],
            hasExistingAssistant: assistantData.exists || false,
          };

          console.log('[DASHBOARD] Setting onboarding data:', data);
          setOnboardingData(data);
          setShowOnboarding(true);
          console.log('[DASHBOARD] Modal should now be visible');
        }

        setOnboardingChecked(true);
      } catch (error) {
        console.error('[DASHBOARD] Failed to check onboarding:', error);
        setOnboardingChecked(true);
      }
    };

    checkOnboarding();
  }, [isAuthenticated, isLoading, onboardingChecked, hasSubscription, user]);

  const handleOnboardingComplete = useCallback(async () => {
    try {
      await userApi.completeOnboarding();
      console.log('[DASHBOARD] Onboarding completed');
    } catch (error) {
      console.error('[DASHBOARD] Failed to complete onboarding:', error);
    }
  }, []);

  const handleOnboardingProgressUpdate = useCallback(
    async (step: number, stepsCompleted: string[], provider?: string, testCallMade?: boolean) => {
      try {
        await userApi.updateOnboarding({
          currentStep: step,
          stepsCompleted,
          callForwardingProvider: provider,
          testCallMade: testCallMade || false,
        });
      } catch (error) {
        console.error('[DASHBOARD] Failed to update onboarding progress:', error);
      }
    },
    []
  );

  // Show loading while checking auth or subscription
  if (isLoading || (isAuthenticated && !subscriptionChecked)) {
    console.log('[DASHBOARD] Rendering loading spinner...', { isLoading, subscriptionChecked });
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    console.log('[DASHBOARD] Not authenticated, returning null');
    return null;
  }

  // Gate dashboard content behind subscription, but keep user inside dashboard with onboarding paywall.
  // Exception: allow /checkout to render so it can redirect to Stripe.
  if (!hasSubscription && !isCheckoutRoute) {
    console.log('[DASHBOARD] No subscription - gating content and showing paywall onboarding');
    return (
      <div className="flex min-h-screen bg-background text-foreground">
        <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
        <div className="flex flex-1 flex-col overflow-hidden">
          <Navbar onMenuClick={toggleSidebar} />
          <main className="flex-1 overflow-y-auto px-4 py-8 lg:px-8">
            <div className="mx-auto max-w-3xl">
              <div className="rounded-2xl border border-border bg-card p-8">
                <h1 className="text-2xl font-bold tracking-tight text-foreground">Subscription required</h1>
                <p className="mt-2 text-muted-foreground">
                  Complete the first onboarding step to choose a plan and activate your dashboard.
                </p>
              </div>
            </div>
          </main>
        </div>
        {devMode && <DevUserSwitcher />}
        {onboardingData && (
          <OnboardingTour
            open={showOnboarding}
            onOpenChange={setShowOnboarding}
            data={onboardingData}
            onComplete={handleOnboardingComplete}
            onProgressUpdate={handleOnboardingProgressUpdate}
            requiresSubscription
            hasSubscription={false}
            onRefreshSubscription={refreshSubscription}
          />
        )}
      </div>
    );
  }

  console.log('[DASHBOARD] Rendering full dashboard');
  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Navbar onMenuClick={toggleSidebar} />
        <main className="flex-1 overflow-y-auto px-4 py-8 lg:px-8">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>
      {/* Dev user switcher - only visible in dev mode */}
      {devMode && <DevUserSwitcher />}

      {/* Onboarding tour modal */}
      {onboardingData && (
        <OnboardingTour
          open={showOnboarding}
          onOpenChange={setShowOnboarding}
          data={onboardingData}
          onComplete={handleOnboardingComplete}
          onProgressUpdate={handleOnboardingProgressUpdate}
          hasSubscription={true}
        />
      )}
    </div>
  );
}
