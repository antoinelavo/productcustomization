// /pages/_app.js

import TrafficTracker from '@/components/TrafficTracker'
import Providers from '@/components/Providers'

import '@/styles/globals.css'

export default function App({ Component, pageProps }) {
  return (
    <Providers>
      <TrafficTracker />
      <Component {...pageProps} />
    </Providers>
  )
}