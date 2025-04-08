import Link from 'next/link'

export default function Navbar() {
  return (
    <nav className="bg-[#2e026d] p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-white text-xl font-bold">
          Bachata Hub
        </Link>
        
        <div className="flex gap-6">
          <Link
            href="/schools"
            className="text-white hover:text-[hsl(280,100%,70%)] transition-colors"
          >
            Schools
          </Link>
          <Link
            href="/events"
            className="text-white hover:text-[hsl(280,100%,70%)] transition-colors"
          >
            Events
          </Link>
          <Link
            href="/festivals"
            className="text-white hover:text-[hsl(280,100%,70%)] transition-colors"
          >
            Festivals
          </Link>
          <Link
            href="/shop"
            className="text-white hover:text-[hsl(280,100%,70%)] transition-colors"
          >
            Shop
          </Link>
          <Link
            href="/instructors"
            className="text-white hover:text-[hsl(280,100%,70%)] transition-colors"
          >
            Instructors
          </Link>
        </div>
      </div>
    </nav>
  )
} 