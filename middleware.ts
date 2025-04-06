import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Get the pathname
  const path = request.nextUrl.pathname

  // Check if it's an admin path
  if (path.startsWith('/admin') && path !== '/admin/login') {
    // Get the admin session cookie
    const adminSession = request.cookies.get('admin_session')

    // If no session or session is not valid, redirect to login
    if (!adminSession || adminSession.value !== 'true') {
      const url = new URL('/admin/login', request.url)
      return NextResponse.redirect(url)
    }
  }

  return NextResponse.next()
}

// Configure which paths the middleware should run on
export const config = {
  matcher: '/admin/:path*'
} 