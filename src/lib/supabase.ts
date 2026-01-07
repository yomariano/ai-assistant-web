import { createBrowserClient } from '@supabase/ssr';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

console.log('[SUPABASE] Initializing client with URL:', supabaseUrl ? 'SET' : 'MISSING');
console.log('[SUPABASE] Anon key:', supabaseAnonKey ? 'SET' : 'MISSING');

export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);

export type AuthProvider = 'google';

export const signInWithGoogle = async () => {
  const redirectTo = `${window.location.origin}/auth/callback`;
  console.log('[SUPABASE] signInWithGoogle - redirectTo:', redirectTo);

  const { data, error } = await supabase.auth.signInWithOAuth({
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
  console.log('[SUPABASE] signOut called');
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error('[SUPABASE] signOut error:', error);
    throw error;
  }
  console.log('[SUPABASE] signOut successful');
};

export const getSession = async () => {
  console.log('[SUPABASE] getSession called');
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
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
    throw e;
  }
};

export const getUser = async () => {
  console.log('[SUPABASE] getUser called');
  const { data: { user }, error } = await supabase.auth.getUser();
  console.log('[SUPABASE] getUser result:', { userId: user?.id, email: user?.email, error: error?.message });
  if (error) throw error;
  return user;
};
