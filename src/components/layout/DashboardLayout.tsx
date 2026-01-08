'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
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
  const { isAuthenticated, isLoading, checkAuth, devMode, user } = useAuthStore();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Onboarding state
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [onboardingData, setOnboardingData] = useState<OnboardingData | null>(null);
  const [onboardingChecked, setOnboardingChecked] = useState(false);

  console.log('[DASHBOARD] ====== DashboardLayout render ======');
  console.log('[DASHBOARD] State:', { isLoading, isAuthenticated, devMode, userEmail: user?.email });

  const toggleSidebar = useCallback(() => setIsSidebarOpen(prev => !prev), []);
  const closeSidebar = useCallback(() => setIsSidebarOpen(false), []);

  useEffect(() => {
    console.log('[DASHBOARD] useEffect - calling checkAuth()');
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    console.log('[DASHBOARD] useEffect - auth state changed:', { isLoading, isAuthenticated });
    if (!isLoading && !isAuthenticated) {
      console.log('[DASHBOARD] Not authenticated, redirecting to /login');
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  // Check onboarding status after authentication
  useEffect(() => {
    const checkOnboarding = async () => {
      console.log('[DASHBOARD] checkOnboarding called:', { isAuthenticated, isLoading, onboardingChecked });
      if (!isAuthenticated || isLoading || onboardingChecked) return;

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
  }, [isAuthenticated, isLoading, onboardingChecked, user]);

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

  if (isLoading) {
    console.log('[DASHBOARD] Rendering loading spinner...');
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
        />
      )}
    </div>
  );
}
