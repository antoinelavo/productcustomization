// /lib/trafficTracker.js
import { supabase } from '@/lib/supabase'

// Generate or get existing session ID
const getSessionId = () => {
  let sessionId = sessionStorage.getItem('session_id')
  if (!sessionId) {
    sessionId = 'sess_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
    sessionStorage.setItem('session_id', sessionId)
  }
  return sessionId
}

// Check if we already tracked this session
const hasTrackedThisSession = () => {
  return sessionStorage.getItem('traffic_tracked') === 'true'
}

// Mark session as tracked
const markSessionTracked = () => {
  sessionStorage.setItem('traffic_tracked', 'true')
}

// Main tracking function
export const captureTrafficSource = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      // Don't track if we already tracked this session
      if (hasTrackedThisSession()) {
        console.log('🔍 Traffic source already tracked for this session')
        resolve('already_tracked')
        return
      }

      const urlParams = new URLSearchParams(window.location.search)
      const pathname = window.location.pathname
      const referrer = document.referrer
      
      console.log('🔍 Analyzing traffic source for:', pathname)
      
      // Determine source, campaign, and medium
      let source = 'direct'
      let campaign = null
      let medium = null
      
      // Check for UTM parameters first (most reliable)
      if (urlParams.get('utm_source')) {
        source = urlParams.get('utm_source')
        campaign = urlParams.get('utm_campaign')
        medium = urlParams.get('utm_medium')
      } 
      // Check for custom source parameter
      else if (urlParams.get('source')) {
        source = urlParams.get('source')
        campaign = urlParams.get('campaign')
        medium = urlParams.get('medium')
      }
      // Check for special paths
      else if (pathname === '/instagram' || pathname === '/ig') {
        source = 'instagram'
        medium = 'bio'
        console.log('📱 Detected Instagram bio link')
      }
      else if (pathname === '/youtube' || pathname === '/yt') {
        source = 'youtube'
        medium = 'video'
        console.log('📺 Detected YouTube link')
      }
      else if (pathname === '/tiktok' || pathname === '/tt') {
        source = 'tiktok'
        medium = 'bio'
        console.log('🎵 Detected TikTok bio link')
      }
      // Check referrer as fallback
      else if (referrer) {
        if (referrer.includes('facebook.com')) {
          source = 'facebook'
          medium = 'organic'
        } else if (referrer.includes('instagram.com')) {
          source = 'instagram'
          medium = 'organic'
        } else if (referrer.includes('youtube.com')) {
          source = 'youtube'
          medium = 'organic'
        } else if (referrer.includes('google.com')) {
          source = 'google'
          medium = 'organic'
        } else if (referrer.includes('twitter.com') || referrer.includes('t.co')) {
          source = 'twitter'
          medium = 'organic'
        } else if (referrer.includes('tiktok.com')) {
          source = 'tiktok'
          medium = 'organic'
        } else {
          source = 'referral'
          medium = 'website'
        }
      }

      // Prepare data to insert
      const trafficData = {
        source: source,
        campaign: campaign,
        medium: medium,
        landing_page: window.location.href,
        user_agent: navigator.userAgent,
        session_id: getSessionId(),
        referrer: referrer || null,
      }

      console.log('📊 Tracking data:', trafficData)

      // Insert into Supabase
      const { data, error } = await supabase
        .from('traffic_sources')
        .insert([trafficData])

      if (error) {
        console.error('❌ Error tracking traffic source:', error)
        reject(error)
      } else {
        console.log('✅ Traffic source tracked successfully:', {
          source: source,
          campaign: campaign,
          medium: medium,
          session_id: getSessionId()
        })
        
        // Mark as tracked so we don't track again in this session
        markSessionTracked()
        resolve('tracked')
      }

    } catch (error) {
      console.error('❌ Error in captureTrafficSource:', error)
      reject(error)
    }
  })
}

// Function to mark conversion when user makes a purchase
export const markConversion = async (orderId) => {
  try {
    const sessionId = getSessionId()
    
    const { data, error } = await supabase
      .from('traffic_sources')
      .update({ 
        converted: true, 
        order_id: orderId 
      })
      .eq('session_id', sessionId)
      .eq('converted', false) // Only update the first unconverted record
      .order('created_at', { ascending: true })
      .limit(1)

    if (error) {
      console.error('❌ Error marking conversion:', error)
    } else {
      console.log('✅ Conversion tracked for order:', orderId)
    }

  } catch (error) {
    console.error('❌ Error in markConversion:', error)
  }
}