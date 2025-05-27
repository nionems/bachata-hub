import { Viewport } from 'next'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#000000'
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
} 