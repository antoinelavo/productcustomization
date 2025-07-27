// pages/tiktok.js
import { useEffect } from 'react'
import { useRouter } from 'next/router'

export default function TiktokRedirect() {
  const router = useRouter()

  useEffect(() => {
    console.log('🎵 TikTok redirect page loaded')
    
    // Wait for TrafficTracker (from _app.js) to do its job
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
      <p>로딩중...</p>
    </div>
  )
}