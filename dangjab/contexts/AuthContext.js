// @/contexts/AuthContext.js
'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

const AuthContext = createContext({})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [authLoading, setAuthLoading] = useState(false)

  // Get user profile data
  const getUserProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error && error.code !== 'PGRST116') {
        throw error
      }

      return data
    } catch (error) {
      console.error('Error fetching user profile:', error)
      return null
    }
  }

  // Create or update user profile
  const upsertProfile = async (userId, profileData) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .upsert({
          id: userId,
          updated_at: new Date().toISOString(),
          ...profileData
        })
        .select()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error upserting profile:', error)
      return null
    }
  }

  // Sign up with email and password
  const signUp = async (email, password, additionalData = {}) => {
    try {
      setAuthLoading(true)
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: additionalData
        }
      })

      if (error) throw error

      // If user is created, create profile
      if (data.user) {
        await upsertProfile(data.user.id, {
          email: data.user.email,
          full_name: additionalData.full_name || '',
          avatar_url: additionalData.avatar_url || null
        })
      }

      return { data, error: null }
    } catch (error) {
      console.error('Error signing up:', error)
      return { data: null, error }
    } finally {
      setAuthLoading(false)
    }
  }

  // Sign in with email and password
  const signIn = async (email, password) => {
    try {
      setAuthLoading(true)
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('Error signing in:', error)
      return { data: null, error }
    } finally {
      setAuthLoading(false)
    }
  }

  // Sign in with OAuth (Google, KakaoTalk, etc.)
  const signInWithProvider = async (provider, options = {}) => {
    try {
      setAuthLoading(true)
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          ...options
        }
      })

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error(`Error signing in with ${provider}:`, error)
      return { data: null, error }
    } finally {
      setAuthLoading(false)
    }
  }

  // Sign out
  const signOut = async () => {
    try {
      setAuthLoading(true)
      
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      
      setUser(null)
      setProfile(null)
      
      return { error: null }
    } catch (error) {
      console.error('Error signing out:', error)
      return { error }
    } finally {
      setAuthLoading(false)
    }
  }

  // Reset password
  const resetPassword = async (email) => {
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`
      })

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('Error resetting password:', error)
      return { data: null, error }
    }
  }

  // Update user profile
  const updateProfile = async (profileData) => {
    try {
      if (!user) throw new Error('No user logged in')

      setAuthLoading(true)
      
      const updatedProfile = await upsertProfile(user.id, profileData)
      if (updatedProfile) {
        setProfile(updatedProfile[0])
      }
      
      return { data: updatedProfile, error: null }
    } catch (error) {
      console.error('Error updating profile:', error)
      return { data: null, error }
    } finally {
      setAuthLoading(false)
    }
  }

  // Initialize auth state
  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Error getting session:', error)
          return
        }

        if (session?.user) {
          setUser(session.user)
          const userProfile = await getUserProfile(session.user.id)
          setProfile(userProfile)
        }
      } catch (error) {
        console.error('Error initializing auth:', error)
      } finally {
        setLoading(false)
      }
    }

    getInitialSession()

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth event:', event)
        
        if (session?.user) {
          setUser(session.user)
          
          // Get or create user profile
          let userProfile = await getUserProfile(session.user.id)
          
          // If no profile exists, create one
          if (!userProfile) {
            const newProfile = await upsertProfile(session.user.id, {
              email: session.user.email,
              full_name: session.user.user_metadata?.full_name || '',
              avatar_url: session.user.user_metadata?.avatar_url || null
            })
            userProfile = newProfile?.[0] || null
          }
          
          setProfile(userProfile)
        } else {
          setUser(null)
          setProfile(null)
        }

        setLoading(false)
      }
    )

    return () => {
      subscription?.unsubscribe()
    }
  }, [])

  const value = {
    user,
    profile,
    loading,
    authLoading,
    signUp,
    signIn,
    signInWithProvider,
    signOut,
    resetPassword,
    updateProfile,
    // Helper functions
    isAuthenticated: !!user,
    isEmailConfirmed: user?.email_confirmed_at != null
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}