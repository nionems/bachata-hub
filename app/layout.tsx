import type { Metadata } from "next"
import { Fredoka } from 'next/font/google'
import "./globals.css"
import { Toaster } from "sonner"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { AIAssistant } from "@/components/AIAssistant"
import { AddToHomeScreenModal } from "@/components/AddToHomeScreenModal"
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
  title: {
    default: 'Bachata Hub Australia - Events, Schools, Instructors & DJs',
    template: '%s | Bachata Hub Australia'
  },
  description: 'Discover the best Bachata events, schools, instructors, and DJs across Australia. Find local classes, socials, festivals, and competitions. Your complete guide to Bachata dancing in Australia.',
  keywords: ['bachata', 'dance', 'australia', 'events', 'classes', 'instructors', 'djs', 'schools', 'social dancing', 'latin dance', 'bachata australia'],
  authors: [{ name: 'Bachata Hub Australia' }],
  creator: 'Bachata Hub Australia',
  publisher: 'Bachata Hub Australia',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://bachata.au'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_AU',
    url: 'https://bachata.au',
    title: 'Bachata Hub Australia - Events, Schools, Instructors & DJs',
    description: 'Discover the best Bachata events, schools, instructors, and DJs across Australia. Find local classes, socials, festivals, and competitions.',
    siteName: 'Bachata Hub Australia',
    images: [
      {
        url: '/images/BACHATA.AU (13).png',
        width: 1200,
        height: 630,
        alt: 'Bachata Hub Australia - Your complete guide to Bachata dancing',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bachata Hub Australia - Events, Schools, Instructors & DJs',
    description: 'Discover the best Bachata events, schools, instructors, and DJs across Australia.',
    images: ['/images/BACHATA.AU (13).png'],
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Bachata Hub',
    startupImage: [
      {
        url: '/favicon.ico',
        media: '(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2)'
      },
      {
        url: '/favicon.ico',
        media: '(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2)'
      },
      {
        url: '/favicon.ico',
        media: '(device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3)'
      }
    ]
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '192x192', type: 'image/x-icon' }
    ],
    apple: [
      { url: '/favicon.ico', sizes: '192x192', type: 'image/x-icon' }
    ],
    shortcut: '/favicon.ico'
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#000000',
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
        <link rel="icon" href="/favicon.ico?v=2" sizes="any" />
        <link rel="apple-touch-icon" href="/favicon.ico?v=2" />
        <link rel="mask-icon" href="/favicon.ico?v=2" />
        <meta name="msapplication-TileImage" content="/favicon.ico?v=2" />
        <meta name="msapplication-TileColor" content="#ffffff" />
        <meta name="theme-color" content="#ffffff" />
        <meta name="google-site-verification" content="your-verification-code" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon.ico?v=2" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon.ico?v=2" />
        <link rel="shortcut icon" href="/favicon.ico?v=2" />

      </head>
      <body className={`${fredoka.className} antialiased min-h-screen flex flex-col`}>
        <Navbar />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
        {/* <AIAssistant /> */}
        <AddToHomeScreenModal />
        <Toaster />
        <Analytics />
      </body>
    </html>
  )
}