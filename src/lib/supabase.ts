import { createClient } from '@/utils/supabase/client';

// Create singleton client instance
let supabaseInstance: ReturnType<typeof createClient> | null = null;

function getSupabase() {
  if (!supabaseInstance) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    console.log('[SUPABASE] Initializing client with URL:', url ? url.substring(0, 40) : 'MISSING');
    console.log('[SUPABASE] Anon key:', key ? 'SET (' + key.length + ' chars)' : 'MISSING');

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
  console.log('[SUPABASE] signInWithGoogle - redirectTo:', redirectTo);

  const { data, error } = await client.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo,
    },
  });

  console.log('[SUPABASE] signInWithGoogle result:', { data, error: error?.message });
  if (error) throw error;
  return data;
};

export const signOut = async () => {
  const client = getSupabase();
  if (!client) {
    console.log('[SUPABASE] Client not initialized, nothing to sign out');
    return;
  }

  console.log('[SUPABASE] signOut called');
  const { error } = await client.auth.signOut();
  if (error) {
    console.error('[SUPABASE] signOut error:', error);
    throw error;
  }
  console.log('[SUPABASE] signOut successful');
};

export const getSession = async () => {
  console.log('[SUPABASE] getSession called');

  const client = getSupabase();
  if (!client) {
    console.log('[SUPABASE] Client not initialized, returning null session');
    return null;
  }

  try {
    // Add timeout to prevent hanging forever (5s)
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('getSession timeout after 5s')), 5000);
    });

    const sessionPromise = client.auth.getSession();

    const { data: { session }, error } = await Promise.race([
      sessionPromise,
      timeoutPromise
    ]);

    console.log('[SUPABASE] getSession result:', {
      hasSession: !!session,
      userId: session?.user?.id,
      email: session?.user?.email,
      expiresAt: session?.expires_at,
      error: error?.message
    });
    if (error) throw error;
    return session;
  } catch (e) {
    console.error('[SUPABASE] getSession exception:', e);
    // Return null instead of throwing to allow fallback to other auth methods
    return null;
  }
};

export const getUser = async () => {
  const client = getSupabase();
  if (!client) {
    console.log('[SUPABASE] Client not initialized, returning null user');
    return null;
  }

  console.log('[SUPABASE] getUser called');
  const { data: { user }, error } = await client.auth.getUser();
  console.log('[SUPABASE] getUser result:', { userId: user?.id, email: user?.email, error: error?.message });
  if (error) throw error;
  return user;
};
