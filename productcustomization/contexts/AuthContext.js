// contexts/AuthContext.js (Simplified version for use with database trigger)
import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { getCurrentUserProfile } from '@/lib/users';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      
      if (session?.user) {
        // Simple backup upsert (like working project)
        await supabase
          .from('users')
          .upsert({ id: session.user.id }, { onConflict: 'id' });
        
        // Get user profile (trigger should have created it)
        const { user: profile } = await getCurrentUserProfile();
        setUserProfile(profile);
      }
      
      setLoading(false);
    };

    getInitialSession();

    // Listen for auth changes (like working project)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Simple backup upsert to ensure user exists
          await supabase
            .from('users')
            .upsert({ id: session.user.id }, { onConflict: 'id' });
          
          // Get user profile (trigger should have created it)
          const { user: profile } = await getCurrentUserProfile();
          setUserProfile(profile);
        } else {
          setUserProfile(null);
        }
        
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const value = {
    user, // auth.users data
    userProfile, // public.users data
    loading,
    signOut: async () => {
      const { error } = await supabase.auth.signOut();
      if (!error) {
        setUser(null);
        setUserProfile(null);
      }
      return { error };
    },
    refreshProfile: async () => {
      if (user) {
        const { user: profile } = await getCurrentUserProfile();
        setUserProfile(profile);
        return profile;
      }
      return null;
    }
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}