// pages/instagram.js
import { useEffect } from 'react'
import { useRouter } from 'next/router'

export default function InstagramRedirect() {
  const router = useRouter()

  useEffect(() => {
    // Small delay to let TrafficTracker capture the source
    const timer = setTimeout(() => {
      router.replace('/') // Redirect to homepage
    }, 100)

    return () => clearTimeout(timer)
  }, [router])

  // Show a loading message while redirecting
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      fontFamily: 'Arial, sans-serif'
    }}>
      <p>Redirecting...</p>
    </div>
  )
}