// pages/instagram.js - FIXED VERSION (no double tracking)
import { useEffect } from 'react'
import { useRouter } from 'next/router'
// ✅ NO import of captureTrafficSource

export default function InstagramRedirect() {
  const router = useRouter()

  useEffect(() => {
    console.log('📱 Instagram redirect page loaded')
    
    // ✅ Just wait for TrafficTracker (from _app.js) to do its job
    // ✅ NO direct call to captureTrafficSource() here
    const timer = setTimeout(() => {
      console.log('🔄 Redirecting to homepage...')
      router.replace('/')
    }, 1500)

    return () => clearTimeout(timer)
  }, [router])

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column',
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      fontFamily: 'Arial, sans-serif'
    }}>
      <p>인스타그램에서 오신걸 환영합니다!</p>
      <p>로딩중...</p>
    </div>
  )
}