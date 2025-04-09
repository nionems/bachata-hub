'use client'

import Link from "next/link"
import { Instagram, Home, Calendar, Users, ShoppingBag, MapPin, Music } from "lucide-react"
import { usePathname } from 'next/navigation'

export default function Footer() {
  const pathname = usePathname()
  
  return (
    <>
      {/* Mobile Bottom Navigation Bar - Only visible on mobile */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-primary text-white z-50 border-t border-gray-700">
        <div className="flex justify-around items-center py-2">
          <MobileNavLink href="/" icon={<Home size={20} />} label="Home" isActive={pathname === '/'} />
          <MobileNavLink href="/events" icon={<Music size={20} />} label="Events" isActive={pathname === '/events'} />
          <MobileNavLink href="/calendar" icon={<Calendar size={20} />} label="Calendar" isActive={pathname === '/calendar'} />
          <MobileNavLink href="/shop" icon={<ShoppingBag size={20} />} label="Shop" isActive={pathname === '/shop'} />
          <MobileNavLink href="/schools" icon={<MapPin size={20} />} label="Schools" isActive={pathname === '/schools'} />
        </div>
      </div>
      
      {/* Regular Footer - Hidden on mobile */}
      <footer className="bg-gray-900 text-white hidden md:block">
        <div className="max-w-7xl mx-auto py-8 sm:py-2 px-2 sm:px-2 lg:px-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="col-span-1 md:col-span-1">
            <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">
                Bachata Australia
              </h2>
            </div>

            <div>
              <h3 className="text-base sm:text-lg font-semibold mb-1 sm:mb-2 text-secondary">Quick Links</h3>
              <ul className="space-y-1 sm:space-y-2">
                <FooterLink href="/events">Events</FooterLink>
                <FooterLink href="/festivals">Festivals</FooterLink>
                <FooterLink href="/schools">Schools</FooterLink>
                <FooterLink href="/instructors">Instructors</FooterLink>
              </ul>
            </div>

            <div>
              <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-secondary">Resources</h3>
              <ul className="space-y-1 sm:space-y-2">
                <FooterLink href="/leaderboard">Jack & Jill Leaderboard</FooterLink>
                <FooterLink href="/calendar">Calendar</FooterLink>
                <FooterLink href="/shop">Shop</FooterLink>
                <FooterLink href="/accommodation">Accommodation</FooterLink>
              </ul>
            </div>

            <div>
             
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 sm:mt-12 pt-6 sm:pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm sm:text-base">
              &copy; {new Date().getFullYear()} Bachata Australia. All rights reserved.
            </p>
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6 mt-4 md:mt-0 text-sm">
              <FooterLink href="/privacy">Privacy Policy</FooterLink>
              <FooterLink href="/terms">Terms of Service</FooterLink>
              <FooterLink href="/contact">Contact Us</FooterLink>
              <div className="flex space-x-1">
                <SocialIcon icon={<Instagram size={18} />} href="https://instagram.com/bachata.au" />
              </div>
            </div>
          </div>
        </div>
      </footer>
      
      {/* Add padding to the bottom of the page on mobile to account for the fixed navigation bar */}
      <div className="md:hidden h-16"></div>
    </>
  )
}

function MobileNavLink({ href, icon, label, isActive }) {
  return (
    <Link 
      href={href} 
      className={`flex flex-col items-center justify-center py-1 px-2 ${
        isActive ? 'text-secondary' : 'text-white'
      }`}
    >
      {icon}
      <span className="text-xs mt-1">{label}</span>
    </Link>
  )
}

function SocialIcon({ icon, href }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="bg-gray-800 p-2 rounded-full hover:bg-secondary transition-colors"
    >
      {icon}
    </a>
  )
}

function FooterLink({ href, children }) {
  return (
    <li>
      <Link 
        href={href} 
        className="text-gray-300 hover:text-secondary transition-colors"
      >
        {children}
      </Link>
    </li>
  )
}
