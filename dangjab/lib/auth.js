// lib/auth.js
import { supabase } from '@/lib/supabase';

export async function signInWithKakao() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'kakao',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`
    }
  });
  
  if (error) {
    console.error('Kakao login error:', error);
    return { error };
  }
  
  return { data };
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  return { error };
}

export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser();
  return { user, error };
}

export async function getAuthSession() {
  const { data: { session }, error } = await supabase.auth.getSession();
  return { session, error };
}