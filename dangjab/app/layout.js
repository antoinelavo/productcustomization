// app/layout.js
import Providers from '@/components/Providers'
import '@/styles/globals.css'

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}