import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const isAdminPath = request.nextUrl.pathname.startsWith('/admin')
  const isLoginPath = request.nextUrl.pathname === '/admin/login'
  const isAdmin = request.cookies.get('isAdmin')?.value === 'true'

  // If trying to access admin routes without being logged in
  if (isAdminPath && !isLoginPath && !isAdmin) {
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }

  // If already logged in and trying to access login page
  if (isLoginPath && isAdmin) {
    return NextResponse.redirect(new URL('/admin/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/admin/:path*',
} 