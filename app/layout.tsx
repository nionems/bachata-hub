import type { Metadata } from "next"
import { Inter, Comic_Neue, Fredoka } from "next/font/google"
import "./global.css"
import { Toaster } from "sonner"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { AIAssistant } from "@/components/AIAssistant"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  preload: true,
  variable: "--font-inter",
})

const comicNeue = Comic_Neue({
  weight: ['400', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-comic-neue',
})

const fredoka = Fredoka({
  weight: ['400', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-fredoka',
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
    <html lang="en">
      <body className={`${inter.variable} ${comicNeue.variable} ${fredoka.variable} min-h-screen flex flex-col`}>
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



import './global.css'