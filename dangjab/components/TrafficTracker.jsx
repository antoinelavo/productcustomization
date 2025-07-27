// /components/TrafficTracker.jsx
import { useEffect } from 'react'
import { captureTrafficSource } from '@/lib/trafficTracker'

export default function TrafficTracker() {
  useEffect(() => {
    console.log('🚀 TrafficTracker component mounted')
    console.log('📍 Current URL:', window.location.href)
    console.log('📍 Current pathname:', window.location.pathname)
    
    captureTrafficSource()
  }, [])

  return null
}