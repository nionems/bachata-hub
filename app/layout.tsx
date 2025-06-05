import type { Metadata } from "next"
import { Fredoka } from 'next/font/google'
import "./globals.css"
import { Toaster } from "sonner"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { AIAssistant } from "@/components/AIAssistant"
import { Analytics } from '@vercel/analytics/react'

const fredoka = Fredoka({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-fredoka',
  preload: true,
  fallback: ['system-ui', 'arial'],
})

export const metadata: Metadata = {
  title: 'Bachata Hub',
  description: 'Your Bachata Guide in Australia',
  manifest: '/manifest.json',
  themeColor: '#000000',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Bachata Hub',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
  icons: {
    icon: [
      { url: '/icons/bachata_icon_72x72.png', sizes: '72x72', type: 'image/png' },
      { url: '/icons/bachata_icon_96x96.png', sizes: '96x96', type: 'image/png' },
      { url: '/icons/bachata_icon_128x128.png', sizes: '128x128', type: 'image/png' },
      { url: '/icons/bachata_icon_144x144.png', sizes: '144x144', type: 'image/png' },
      { url: '/icons/bachata_icon_152x152.png', sizes: '152x152', type: 'image/png' },
      { url: '/icons/bachata_icon_192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/bachata_icon_384x384.png', sizes: '384x384', type: 'image/png' },
      { url: '/icons/bachata_icon_512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/icons/bachata_icon_72x72.png', sizes: '72x72', type: 'image/png' },
      { url: '/icons/bachata_icon_96x96.png', sizes: '96x96', type: 'image/png' },
      { url: '/icons/bachata_icon_128x128.png', sizes: '128x128', type: 'image/png' },
      { url: '/icons/bachata_icon_144x144.png', sizes: '144x144', type: 'image/png' },
      { url: '/icons/bachata_icon_152x152.png', sizes: '152x152', type: 'image/png' },
      { url: '/icons/bachata_icon_192x192.png', sizes: '192x192', type: 'image/png' },
    ],
    shortcut: '/icons/bachata_icon_192x192.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={fredoka.variable}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={`${fredoka.className} antialiased min-h-screen flex flex-col`}>
        <Navbar />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
        <AIAssistant />
        <Toaster />
        <Analytics />
      </body>
    </html>
  )
}