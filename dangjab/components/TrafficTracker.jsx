// /components/TrafficTracker.jsx
'use client'

import { useEffect } from 'react'
import { captureTrafficSource } from '@/lib/trafficTracker'

export default function TrafficTracker() {
  useEffect(() => {
    captureTrafficSource()
  }, [])

  return null
}