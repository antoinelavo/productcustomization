// lib/users.js
import { supabase } from '@/lib/supabase';

// Get current user profile from public.users table
export async function getCurrentUserProfile() {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return { user: null, error: null };
  }

  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single();

  if (error) {
    console.error('Error fetching user profile:', error);
    return { user: null, error };
  }

  return { user: data, error: null };
}

// Update user profile
export async function updateUserProfile(updates) {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return { error: 'User not authenticated' };
  }

  const { data, error } = await supabase
    .from('users')
    .update({
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq('id', user.id)
    .select()
    .single();

  if (error) {
    console.error('Error updating user profile:', error);
    return { user: null, error };
  }

  return { user: data, error: null };
}

// Get user by ID (useful for reviews, etc.)
export async function getUserById(userId) {
  const { data, error } = await supabase
    .from('users')
    .select('id, display_name, created_at')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Error fetching user by ID:', error);
    return { user: null, error };
  }

  return { user: data, error: null };
}