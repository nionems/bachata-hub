'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  return (
    <nav className="bg-primary p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-white text-xl font-bold">
          <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent hover:opacity-80 transition-opacity">
            Bachata.au
          </span>
        </Link>
        
        {/* Mobile menu button */}
        <button 
          className="md:hidden text-white focus:outline-none"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <svg 
            className="w-6 h-6" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            {isMenuOpen ? (
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M6 18L18 6M6 6l12 12" 
              />
            ) : (
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M4 6h16M4 12h16M4 18h16" 
              />
            )}
          </svg>
        </button>
        
        {/* Desktop menu */}
        <div className="hidden md:flex gap-6">
          <Link
            href="/schools"
            className="text-white hover:text-secondary transition-colors"
          >
            Schools
          </Link>
          <Link
            href="/events"
            className="text-white hover:text-secondary transition-colors"
          >
            Events
          </Link>
          <Link
            href="/festivals"
            className="text-white hover:text-secondary transition-colors"
          >
            Festivals
          </Link>
          <Link
            href="/shop"
            className="text-white hover:text-secondary transition-colors"
          >
            Shop
          </Link>
          <Link
            href="/instructors"
            className="text-white hover:text-secondary transition-colors"
          >
            Instructors
          </Link>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-primary py-4 px-6">
          <div className="flex flex-col gap-4">
            <Link
              href="/schools"
              className="text-white hover:text-secondary transition-colors py-2"
              onClick={closeMenu}
            >
              Schools
            </Link>
            <Link
              href="/events"
              className="text-white hover:text-secondary transition-colors py-2"
              onClick={closeMenu}
            >
              Events
            </Link>
            <Link
              href="/festivals"
              className="text-white hover:text-secondary transition-colors py-2"
              onClick={closeMenu}
            >
              Festivals
            </Link>
            <Link
              href="/shop"
              className="text-white hover:text-secondary transition-colors py-2"
              onClick={closeMenu}
            >
              Shop
            </Link>
            <Link
              href="/instructors"
              className="text-white hover:text-secondary transition-colors py-2"
              onClick={closeMenu}
            >
              Instructors
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
} 