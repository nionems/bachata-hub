import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Use ipapi.co for geolocation
    const response = await fetch('https://ipapi.co/json/')
    
    if (!response.ok) {
      throw new Error('Failed to fetch location data')
    }

    const data = await response.json()
    
    return NextResponse.json({
      city: data.city || 'Sydney',
      region: data.region || 'New South Wales',
      country_name: data.country_name || 'Australia',
      state: data.region_code || 'NSW'
    })
  } catch (error) {
    console.error('Error fetching geolocation:', error)
    
    // Return fallback data
    return NextResponse.json({
      city: 'Sydney',
      region: 'New South Wales',
      country_name: 'Australia',
      state: 'NSW'
    })
  }
} 