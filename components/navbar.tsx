"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const handleLoginClick = () => {
    window.location.href = '/community'
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
    { name: "Shops", href: "/shop" },
    { name: "Accommodations", href: "/accommodations" },
    { name: "Calendar", href: "/calendar" },
  ]

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-4">
        <div className="flex justify-between h-12 sm:h-14">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <Image
                src="/images/BACHATA.AU (13).png"
                alt="Bachata Australia Logo"
                width={200}
                height={200}
                className="h-12 w-12 sm:h-24 sm:w-24"
                priority
                style={{ objectFit: 'contain' }}
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-2 lg:space-x-6 items-center">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-700 hover:text-green-600 px-2 py-1 text-sm font-medium whitespace-nowrap"
              >
                {item.name}
              </Link>
            ))}
            <Button size="sm" className="bg-primary hover:bg-primary/90 text-white" onClick={handleLoginClick}>
              Join the Community
            </Button>
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-green-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-500"
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
        <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-lg">
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
            <Button className="w-full mt-4 bg-primary hover:bg-primary/90 text-white" onClick={handleLoginClick}>
              Join the Community
            </Button>
          </div>
        </div>
      )}
    </header>
  )}
