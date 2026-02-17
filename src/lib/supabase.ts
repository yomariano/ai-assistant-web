import { createClient } from '@/utils/supabase/client';
import type { Session } from '@supabase/supabase-js';

// Create singleton client instance
let supabaseInstance: ReturnType<typeof createClient> | null = null;
type GetSessionResponse = Awaited<ReturnType<ReturnType<typeof createClient>['auth']['getSession']>>;
let sessionRequestInFlight: Promise<GetSessionResponse> | null = null;

function getSupabase() {
  if (!supabaseInstance) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (url && key) {
      supabaseInstance = createClient();
    }
  }
  return supabaseInstance;
}

export const supabase = getSupabase();

export type AuthProvider = 'google';

export const signInWithGoogle = async () => {
  const client = getSupabase();
  if (!client) {
    console.error('[SUPABASE] Client not initialized');
    throw new Error('Supabase client not initialized');
  }

  const redirectTo = `${window.location.origin}/auth/callback`;

  const { data, error } = await client.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo,
    },
  });
  if (error) throw error;
  return data;
};

export const signOut = async () => {
  const client = getSupabase();
  if (!client) {
    return;
  }

  const { error } = await client.auth.signOut();
  if (error) {
    throw error;
  }
};

export interface GetSessionResult {
  session: Session | null;
  didTimeout: boolean;
  errorMessage?: string;
}

export const getSessionResult = async (
  { timeoutMs = 5000 }: { timeoutMs?: number } = {}
): Promise<GetSessionResult> => {
  const client = getSupabase();
  if (!client) {
    return { session: null, didTimeout: false };
  }

  const timeoutPromise = new Promise<{ type: 'timeout' }>((resolve) => {
    setTimeout(() => resolve({ type: 'timeout' }), timeoutMs);
  });

  if (!sessionRequestInFlight) {
    sessionRequestInFlight = client.auth
      .getSession()
      .finally(() => {
        sessionRequestInFlight = null;
      });
  }

  const sessionPromise = sessionRequestInFlight
    .then((result) => ({ type: 'session' as const, result }))
    .catch((error: unknown) => ({ type: 'error' as const, error }));

  const outcome = await Promise.race([timeoutPromise, sessionPromise]);

  if (outcome.type === 'timeout') {
    // Clear deduped request so the next call can retry with a fresh `getSession` attempt.
    sessionRequestInFlight = null;
    const errorMessage = `getSession timeout after ${timeoutMs}ms`;
    return { session: null, didTimeout: true, errorMessage };
  }

  if (outcome.type === 'error') {
    const errorMessage = outcome.error instanceof Error ? outcome.error.message : String(outcome.error);
    return { session: null, didTimeout: false, errorMessage };
  }

  const {
    data: { session },
    error,
  } = outcome.result;

  if (error) {
    return { session: null, didTimeout: false, errorMessage: error.message };
  }

  return { session, didTimeout: false };
};

export const getSession = async (): Promise<Session | null> => {
  const { session } = await getSessionResult();
  return session;
};

export const getUser = async () => {
  const client = getSupabase();
  if (!client) {
    return null;
  }

  const { data: { user }, error } = await client.auth.getUser();
  if (error) throw error;
  return user;
};
