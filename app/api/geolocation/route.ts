import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    // Get client IP address from request headers
    const forwarded = request.headers.get('x-forwarded-for')
    const realIp = request.headers.get('x-real-ip')
    const clientIp = forwarded ? forwarded.split(',')[0] : realIp || 'unknown'
    
    console.log('Client IP address:', clientIp)

    // If we're in development or can't get IP, use fallback
    if (clientIp === 'unknown' || clientIp === '127.0.0.1' || clientIp === '::1') {
      console.log('Using fallback location for development/localhost')
      return NextResponse.json({
        city: 'Sydney',
        region: 'New South Wales',
        country_name: 'Australia',
        state: 'NSW'
      })
    }

    // Use ipapi.co with the client's IP address
    try {
      console.log('Fetching geolocation for IP:', clientIp)
      const response = await fetch(`https://ipapi.co/${clientIp}/json/`, {
        headers: {
          'User-Agent': 'BachataHub/1.0'
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        console.log('ipapi.co response:', data)
        
        if (!data.error) {
          const locationData = {
            city: data.city || 'Sydney',
            region: data.region || 'New South Wales',
            country_name: data.country_name || 'Australia',
            state: data.region_code || 'NSW'
          }
          
          console.log('Final location data:', locationData)
          return NextResponse.json(locationData)
        }
      }
    } catch (ipapiError) {
      console.error('Error with ipapi.co:', ipapiError)
    }

    // Fallback to ip-api.com
    try {
      console.log('Trying ip-api.com fallback')
      const response = await fetch(`http://ip-api.com/json/${clientIp}`)
      
      if (response.ok) {
        const data = await response.json()
        console.log('ip-api.com response:', data)
        
        if (data.status === 'success') {
          const locationData = {
            city: data.city || 'Sydney',
            region: data.regionName || 'New South Wales',
            country_name: data.country || 'Australia',
            state: data.region || 'NSW'
          }
          
          console.log('Final location data (ip-api.com):', locationData)
          return NextResponse.json(locationData)
        }
      }
    } catch (ipApiError) {
      console.error('Error with ip-api.com:', ipApiError)
    }

    // If all services fail, return fallback data
    console.log('All geolocation services failed, using fallback')
    return NextResponse.json({
      city: 'Sydney',
      region: 'New South Wales',
      country_name: 'Australia',
      state: 'NSW'
    })
    
  } catch (error) {
    console.error('Error in geolocation API:', error)
    
    // Return fallback data for Australia
    return NextResponse.json({
      city: 'Sydney',
      region: 'New South Wales',
      country_name: 'Australia',
      state: 'NSW'
    })
  }
} 