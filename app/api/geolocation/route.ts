import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Use a different geolocation service that's more reliable
    const response = await fetch('https://api.ipapi.com/api/check?access_key=free')
    
    if (!response.ok) {
      throw new Error('Failed to fetch location data')
    }

    const data = await response.json()
    
    return NextResponse.json({
      city: data.city || 'Sydney',
      region: data.region_name || 'New South Wales',
      country: data.country_name || 'Australia',
      state: data.region_code || 'NSW',
      stateFull: data.region_name || 'New South Wales'
    })
  } catch (error) {
    console.error('Error fetching geolocation:', error)
    
    // Return fallback data
    return NextResponse.json({
      city: 'Sydney',
      region: 'New South Wales',
      country: 'Australia',
      state: 'NSW',
      stateFull: 'New South Wales'
    })
  }
} 