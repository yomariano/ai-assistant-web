import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '@/types';
import { authApi } from './api';
import { signInWithGoogle, signOut as supabaseSignOut, getSession } from './supabase';
import { createClient } from '@/utils/supabase/client';

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  devMode: boolean;
  hasExplicitlyLoggedOut: boolean;

  loginWithGoogle: () => Promise<void>;
  devLogin: () => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: User) => void;
  checkAuth: () => Promise<void>;
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
            hasExplicitlyLoggedOut: false
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
        set({ user: null, token: null, isAuthenticated: false, devMode: false, hasExplicitlyLoggedOut: true });
      },

      setUser: (user: User) => {
        set({ user });
      },

      checkAuth: async () => {
        console.log('[STORE] checkAuth started');
        const { hasExplicitlyLoggedOut } = get();

        // If user explicitly logged out, don't auto-login
        if (hasExplicitlyLoggedOut) {
          console.log('[STORE] User has explicitly logged out, skipping auto-login');
          set({ isLoading: false, isAuthenticated: false });
          return;
        }

        try {
          // Check for dev mode FIRST (faster, no Supabase dependency)
          try {
            console.log('[STORE] Checking dev mode config...');
            const config = await authApi.getConfig();
            console.log('[STORE] Dev mode config:', config);
            if (config.devMode) {
              // Try dev login
              console.log('[STORE] Dev mode enabled, attempting dev login...');
              const { user, devMode } = await authApi.devLogin();
              console.log('[STORE] Dev login successful:', user?.email);
              set({
                user,
                token: 'dev-mode',
                isAuthenticated: true,
                devMode,
                isLoading: false
              });
              return;
            }
          } catch (error) {
            console.error('[STORE] Config/dev-login failed:', error);
            // Continue to Supabase auth
          }

          // Try Supabase session (only if dev mode is not enabled)
          let session = null;
          try {
            console.log('[STORE] Checking Supabase session...');
            session = await getSession();
            console.log('[STORE] Supabase session:', session ? 'exists' : 'none');
          } catch (sessionError) {
            console.error('[STORE] Failed to get Supabase session:', sessionError);
          }

          if (session?.access_token) {
            // Get user profile from our backend
            try {
              console.log('[STORE] Calling /api/auth/me...');
              const { user } = await authApi.me(session.access_token);
              console.log('[STORE] Got user profile:', user?.email);
              set({
                user,
                token: session.access_token,
                isAuthenticated: true,
                isLoading: false,
                devMode: false
              });
              return;
            } catch (error) {
              console.error('[STORE] Failed to get user profile:', error);
            }
          }

          console.log('[STORE] No auth found, setting unauthenticated');
          set({ isLoading: false, isAuthenticated: false });
        } catch (error) {
          console.error('[STORE] Auth check failed:', error);
          set({ user: null, token: null, isAuthenticated: false, isLoading: false });
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        token: state.token,
        devMode: state.devMode,
        hasExplicitlyLoggedOut: state.hasExplicitlyLoggedOut
      }),
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
        if (event === 'SIGNED_IN' && session) {
          try {
            const { user } = await authApi.me(session.access_token);
            useAuthStore.setState({
              user,
              token: session.access_token,
              isAuthenticated: true,
              devMode: false,
              isLoading: false
            });

            // Check if user was trying to checkout before login
            const redirectPath = sessionStorage.getItem('redirectAfterLogin');
            if (redirectPath) {
              sessionStorage.removeItem('redirectAfterLogin');
              window.location.href = redirectPath;
            }
          } catch (error) {
            console.error('Failed to get user after sign in:', error);
          }
        } else if (event === 'SIGNED_OUT') {
          useAuthStore.setState({
            user: null,
            token: null,
            isAuthenticated: false,
            devMode: false
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
