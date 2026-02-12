import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '@/types';
import { authApi } from './api';
import { signInWithGoogle, signOut as supabaseSignOut, getSessionResult } from './supabase';
import { createClient } from '@/utils/supabase/client';

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  devMode: boolean;
  hasExplicitlyLoggedOut: boolean;
  sessionRetryCount: number;
  authError: string | null;
  isHydrated: boolean; // True when Zustand has finished rehydrating from localStorage
  setHydrated: (hydrated: boolean) => void;

  loginWithGoogle: () => Promise<void>;
  devLogin: () => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: User) => void;
  checkAuth: () => Promise<void>;
  retryAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: true,
      isAuthenticated: false,
      devMode: false,
      hasExplicitlyLoggedOut: false,
      sessionRetryCount: 0,
      authError: null,
      isHydrated: false,
      setHydrated: (hydrated: boolean) => set({ isHydrated: hydrated }),

      loginWithGoogle: async () => {
        set({ hasExplicitlyLoggedOut: false });
        await signInWithGoogle();
        // The redirect will happen automatically
      },

      devLogin: async () => {
        try {
          const { user, devMode } = await authApi.devLogin();
          set({
            user,
            token: 'dev-mode',
            isAuthenticated: true,
            devMode: devMode,
            isLoading: false,
            hasExplicitlyLoggedOut: false,
            sessionRetryCount: 0,
          });
        } catch (error) {
          console.error('Dev login failed:', error);
          throw error;
        }
      },

      logout: async () => {
        const { devMode } = get();
        if (!devMode) {
          await supabaseSignOut();
        }
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          devMode: false,
          hasExplicitlyLoggedOut: true,
          sessionRetryCount: 0,
        });
      },

      setUser: (user: User) => {
        set({ user });
      },

      checkAuth: async () => {
        console.log('[STORE] checkAuth started');
        const { hasExplicitlyLoggedOut } = get();
        set({ isLoading: true });

        try {
          // Check for Supabase session FIRST - if user has a valid session, use it
          // This handles the race condition where hasExplicitlyLoggedOut might be stale
          // after a successful OAuth login
          let session = null;
          try {
            console.log('[STORE] Checking Supabase session...');
            const sessionResult = await getSessionResult({ timeoutMs: 10000 });
            session = sessionResult.session;
            if (sessionResult.didTimeout) {
              const retryCount = get().sessionRetryCount;
              const MAX_SESSION_RETRIES = 2;
              if (retryCount < MAX_SESSION_RETRIES) {
                const delay = 1000 * Math.pow(2, retryCount); // 1s, 2s
                console.warn(`[STORE] Supabase getSession timed out; retry ${retryCount + 1}/${MAX_SESSION_RETRIES} in ${delay}ms...`);
                set({ sessionRetryCount: retryCount + 1 });
                setTimeout(() => {
                  void get().checkAuth();
                }, delay);
                return;
              }
              console.error('[STORE] Supabase session timed out after', MAX_SESSION_RETRIES, 'retries — giving up');
              set({
                isLoading: false,
                isAuthenticated: false,
                sessionRetryCount: 0,
                authError: 'Unable to connect to the authentication service. Please check your connection and try again.',
              });
              return;
            }
            console.log('[STORE] Supabase session:', session ? 'exists' : 'none');
          } catch (sessionError) {
            console.error('[STORE] Failed to get Supabase session:', sessionError);
          }

          // If we have a valid session, authenticate the user
          // This takes precedence over hasExplicitlyLoggedOut since the user actively logged in
          if (session?.access_token) {
            try {
              console.log('[STORE] Calling /api/auth/me...');
              const { user } = await authApi.me(session.access_token);
              console.log('[STORE] Got user profile:', user?.email);
              set({
                user,
                token: session.access_token,
                isAuthenticated: true,
                isLoading: false,
                devMode: false,
                sessionRetryCount: 0,
                authError: null,
                hasExplicitlyLoggedOut: false, // Clear stale logout flag since user is now logged in
              });
              return;
            } catch (error) {
              console.error('[STORE] Failed to get user profile:', error);
              // Continue to check other auth methods
            }
          }

          // No valid Supabase session - now check if user explicitly logged out
          // Only skip auto-login if there's no session AND user explicitly logged out
          if (hasExplicitlyLoggedOut) {
            console.log('[STORE] User has explicitly logged out and no active session, skipping auto-login');
            set({ isLoading: false, isAuthenticated: false, sessionRetryCount: 0 });
            return;
          }

          // Check for dev mode (fallback when no Supabase session)
          try {
            console.log('[STORE] Checking dev mode config...');
            const config = await authApi.getConfig();
            console.log('[STORE] Dev mode config:', config);
            if (config.devMode) {
              console.log('[STORE] Dev mode enabled, attempting dev login...');
              const { user, devMode } = await authApi.devLogin();
              console.log('[STORE] Dev login successful:', user?.email);
              set({
                user,
                token: 'dev-mode',
                isAuthenticated: true,
                devMode,
                isLoading: false,
                sessionRetryCount: 0,
              });
              return;
            }
          } catch (error) {
            console.error('[STORE] Config/dev-login failed:', error);
          }

          console.log('[STORE] No auth found, setting unauthenticated');
          set({ isLoading: false, isAuthenticated: false, sessionRetryCount: 0 });
        } catch (error) {
          console.error('[STORE] Auth check failed:', error);
          set({ user: null, token: null, isAuthenticated: false, isLoading: false, sessionRetryCount: 0 });
        }
      },

      retryAuth: async () => {
        set({ sessionRetryCount: 0, authError: null, isLoading: true });
        await get().checkAuth();
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        token: state.token,
        devMode: state.devMode,
        hasExplicitlyLoggedOut: state.hasExplicitlyLoggedOut
      }),
      onRehydrateStorage: () => (state) => {
        // Called when rehydration from localStorage is complete
        if (state) {
          state.setHydrated(true);
          console.log('[STORE] Hydration complete');
        }
      },
    }
  )
);

// Listen for Supabase auth changes
if (typeof window !== 'undefined') {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseKey) {
      const supabase = createClient();
      supabase.auth.onAuthStateChange(async (event, session) => {
        console.log('[STORE] Auth state changed:', event);
        if ((event === 'SIGNED_IN' || event === 'INITIAL_SESSION' || event === 'TOKEN_REFRESHED') && session) {
          try {
            const { user } = await authApi.me(session.access_token);
            useAuthStore.setState({
              user,
              token: session.access_token,
              isAuthenticated: true,
              devMode: false,
              isLoading: false,
              sessionRetryCount: 0,
              authError: null,
              hasExplicitlyLoggedOut: false, // Clear stale logout flag since user is now logged in
            });

            // Check if user was trying to checkout before login
            const redirectPath = sessionStorage.getItem('redirectAfterLogin');
            if (redirectPath) {
              sessionStorage.removeItem('redirectAfterLogin');
              window.location.href = redirectPath;
            }
          } catch (error) {
            console.error('Failed to get user after sign in:', error);
            // User has valid Supabase session but doesn't exist in our database
            // This can happen if user was deleted. Clear auth state and redirect.
            console.log('[STORE] User not found in database, clearing auth state');
            useAuthStore.setState({
              user: null,
              token: null,
              isAuthenticated: false,
              devMode: false,
              isLoading: false,
              sessionRetryCount: 0,
            });
            // Sign out of Supabase to clear the invalid session
            try {
              await supabase.auth.signOut();
            } catch (signOutError) {
              console.error('[STORE] Failed to sign out:', signOutError);
            }
            // Clear localStorage to prevent stale state
            localStorage.removeItem('auth-storage');
            // Redirect to home page
            window.location.href = '/';
          }
        } else if (event === 'SIGNED_OUT') {
          useAuthStore.setState({
            user: null,
            token: null,
            isAuthenticated: false,
            devMode: false,
            sessionRetryCount: 0,
            hasExplicitlyLoggedOut: true, // Mark as logged out to prevent auto-login
          });
        }
      });
    }
  } catch (e) {
    console.error('[STORE] Failed to setup auth state listener:', e);
  }
}

// Call form state
interface CallFormState {
  phoneNumber: string;
  contactName: string;
  message: string;
  language: string;
  setPhoneNumber: (phoneNumber: string) => void;
  setContactName: (contactName: string) => void;
  setMessage: (message: string) => void;
  setLanguage: (language: string) => void;
  loadFromSavedCall: (call: { phoneNumber: string; contactName?: string; message: string; language: string }) => void;
  reset: () => void;
}

export const useCallFormStore = create<CallFormState>((set) => ({
  phoneNumber: '',
  contactName: '',
  message: '',
  language: 'en',

  setPhoneNumber: (phoneNumber) => set({ phoneNumber }),
  setContactName: (contactName) => set({ contactName }),
  setMessage: (message) => set({ message }),
  setLanguage: (language) => set({ language }),

  loadFromSavedCall: (call) => set({
    phoneNumber: call.phoneNumber,
    contactName: call.contactName || '',
    message: call.message,
    language: call.language,
  }),

  reset: () => set({
    phoneNumber: '',
    contactName: '',
    message: '',
    language: 'en',
  }),
}));

// Billing/Subscription state
interface Subscription {
  plan_id: string;
  status: string;
  current_period_start?: string;
  current_period_end?: string;
  cancel_at_period_end?: boolean;
  region?: 'EU' | 'AR';
  currency?: 'EUR' | 'USD';
}

interface UsageData {
  // Regional info
  region?: 'EU' | 'AR';
  currency?: 'EUR' | 'USD';
  currencySymbol?: string;
  // Minute-based data (Feb 2026)
  minutesUsed?: number;
  minutesIncluded?: number;
  minutesRemaining?: number;
  overageMinutes?: number;
  overageChargesCents?: number;
  overageChargesFormatted?: string;
  perMinuteRateCents?: number;
  perMinuteRateFormatted?: string;
  // Legacy call-based data (backwards compat)
  callsMade?: number;
  callsRemaining?: number | null;
  fairUseCap?: number | null;
}

interface BillingState {
  subscription: Subscription | null;
  usage: UsageData | null;
  isLoading: boolean;
  setSubscription: (subscription: Subscription | null) => void;
  setUsage: (usage: UsageData | null) => void;
  setLoading: (isLoading: boolean) => void;
  clear: () => void;
}

const planDetails: Record<string, { name: string; color: string }> = {
  starter: { name: 'Starter', color: 'bg-slate-600' },
  growth: { name: 'Growth', color: 'bg-indigo-600' },
  pro: { name: 'Pro', color: 'bg-violet-600' },
};

export const useBillingStore = create<BillingState>((set) => ({
  subscription: null,
  usage: null,
  isLoading: false,

  setSubscription: (subscription) => set({ subscription, isLoading: false }),
  setUsage: (usage) => set({ usage }),
  setLoading: (isLoading) => set({ isLoading }),
  clear: () => set({ subscription: null, usage: null, isLoading: false }),
}));

// Helper to get plan display name
export const getPlanDisplayName = (planId: string | undefined): string => {
  if (!planId) return 'Free';
  return planDetails[planId]?.name || planId;
};

// Helper to get plan badge color
export const getPlanBadgeColor = (planId: string | undefined): string => {
  if (!planId) return 'bg-slate-500';
  return planDetails[planId]?.color || 'bg-slate-600';
};
