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
    startupImage: [
      {
        url: '/icons/homescreenIcon/bachata_icon_512x512.png',
        media: '(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2)'
      },
      {
        url: '/icons/homescreenIcon/bachata_icon_512x512.png',
        media: '(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2)'
      },
      {
        url: '/icons/homescreenIcon/bachata_icon_512x512.png',
        media: '(device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3)'
      }
    ]
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
  icons: {
    icon: [
      { url: '/icons/rounded/rounded.png', sizes: '512x512', type: 'image/png' }
    ],
    apple: [
      { url: '/icons/homescreenIcon/bachata_icon_152x152.png', sizes: '152x152', type: 'image/png' },
      { url: '/icons/homescreenIcon/bachata_icon_192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/homescreenIcon/bachata_icon_512x512.png', sizes: '512x512', type: 'image/png' }
    ],
    shortcut: '/icons/rounded/rounded.png'
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
        <link rel="icon" type="image/png" sizes="512x512" href="/icons/rounded/rounded.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/icons/homescreenIcon/bachata_icon_152x152.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/homescreenIcon/bachata_icon_192x192.png" />
        <link rel="apple-touch-icon" sizes="167x167" href="/icons/homescreenIcon/bachata_icon_152x152.png" />
        <link rel="mask-icon" href="/icons/rounded/rounded.png" color="#000000" />
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