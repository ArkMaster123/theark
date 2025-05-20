import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'TH3 ARK',
  description: 'TH3 ARK - Noah\'s Home for AI Agents',
  generator: 'v0.dev',
  icons: {
    icon: '/icon.png', // or '/favicon.ico'
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-black text-white">
        {children}
      </body>
    </html>
  )
}
