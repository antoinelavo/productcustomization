// @/app/auth/callback/page.js
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function AuthCallback() {
  const router = useRouter()

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Handle the OAuth callback
        const { data, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Auth callback error:', error)
          router.push('/auth/login?error=callback-error')
          return
        }

        if (data?.session) {
          // Successfully authenticated
          console.log('Auth successful:', data.session.user)
          
          // Redirect to intended page or dashboard
          const returnTo = localStorage.getItem('authReturnTo') || '/'
          localStorage.removeItem('authReturnTo')
          
          router.push(returnTo)
        } else {
          // No session found
          router.push('/auth/login?error=no-session')
        }
      } catch (error) {
        console.error('Unexpected error in auth callback:', error)
        router.push('/auth/login?error=unexpected')
      }
    }

    handleAuthCallback()
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">로그인 처리 중...</p>
      </div>
    </div>
  )
}