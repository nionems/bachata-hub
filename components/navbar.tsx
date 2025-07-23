"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Menu, X, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isIPad, setIsIPad] = useState(false)

  // Detect iPad
  useEffect(() => {
    const detectIPad = () => {
      if (typeof window === 'undefined') return false
      const userAgent = navigator.userAgent.toLowerCase()
      return userAgent.includes('ipad') || 
             (userAgent.includes('macintosh') && 'ontouchend' in document) ||
             (window.innerWidth >= 768 && window.innerWidth <= 1024 && 'ontouchend' in document)
    }
    
    setIsIPad(detectIPad())
  }, [])

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const handleLoginClick = () => {
    window.location.href = '/community'
  }

  const handleRefresh = () => {
    window.location.reload()
  }

  const navItems = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Events", href: "/events" },
    { name: "Festivals", href: "/festivals" },
    { name: "Schools", href: "/schools" },
    { name: "Instructors", href: "/instructors" },
    { name: "DJs", href: "/djs" },
    { name: "Media", href: "/media" },
    { name: "Competitions", href: "/competitions" },
    { name: "Marketplace", href: "/shop" },
    { name: "Accommodations", href: "/accommodations" },
    { name: "Calendar", href: "/calendar" },
  ]

  return (
    <header className="bg-white/90 backdrop-blur-sm shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-4">
        <div className="flex justify-between h-20 sm:h-20">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <Image
                src="/images/BACHATA.AU (13).png"
                alt="Bachata Australia Logo"
                width={200}
                height={200}
                className="h-[72px] w-[72px] sm:h-20 sm:w-20 md:h-20 md:w-20 lg:h-24 lg:w-24 rounded-full"
                priority
                style={{ objectFit: 'contain' }}
              />
            </Link>
            {/* Mobile Refresh Button */}
            <button
              onClick={handleRefresh}
              className="md:hidden inline-flex items-center justify-center p-2 rounded-full text-gray-500 hover:text-primary hover:bg-primary/10 transition-colors duration-200"
              title="Refresh page"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center overflow-x-auto scrollbar-hide">
            <div className="flex space-x-1 md:space-x-1 lg:space-x-2 items-center">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                  className={`text-gray-700 hover:text-green-600 px-1 md:px-2 py-1 text-xs md:text-sm font-medium whitespace-nowrap ${
                    item.name === "Home" ? "hidden" : ""
                  }`}
              >
                {item.name}
              </Link>
            ))}
              {!isIPad && (
                <Link href="/community">
                  <Button size="sm" className="bg-gradient-to-r from-emerald-500 to-violet-500 hover:from-emerald-600 hover:to-violet-600 text-white ml-2 whitespace-nowrap text-xs md:text-sm px-2 py-1 shadow-lg hover:shadow-xl transition-all duration-200">
                    Join the Community
                  </Button>
                </Link>
              )}
            </div>
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-primary hover:text-primary/80 hover:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
              aria-expanded={isMenuOpen}
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <X className="block h-5 w-5" aria-hidden="true" />
              ) : (
                <Menu className="block h-5 w-5" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-lg z-[100]">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 max-h-[80vh] overflow-y-auto">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-700 hover:text-green-600 block px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            {!isIPad && (
              <Button className="w-full mt-4 bg-gradient-to-r from-emerald-500 to-violet-500 hover:from-emerald-600 hover:to-violet-600 text-white shadow-lg hover:shadow-xl transition-all duration-200" onClick={handleLoginClick}>
                Join the Community
              </Button>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
