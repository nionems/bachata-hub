import type { Metadata } from "next"
import { Fredoka } from 'next/font/google'
import "./globals.css"
import { Toaster } from "sonner"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { AIAssistant } from "@/components/AIAssistant"

const fredoka = Fredoka({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-fredoka',
  preload: true,
  fallback: ['system-ui', 'arial'],
})

export const metadata: Metadata = {
  title: "Bachata Hub - Find Bachata Events in Australia",
  description: "Discover Bachata events, classes, and socials across Australia. Connect with the Bachata community and find your next dance event.",
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
      </body>
    </html>
  )
}