import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Try multiple geolocation services for better reliability
    const services = [
      'https://ipapi.co/json/',
      'https://ip-api.com/json/',
      'https://api.ipify.org?format=json'
    ]

    let locationData = null

    for (const service of services) {
      try {
        console.log(`Trying geolocation service: ${service}`)
        const response = await fetch(service, {
          headers: {
            'User-Agent': 'BachataHub/1.0'
          }
        })
        
        if (response.ok) {
          const data = await response.json()
          console.log(`Service ${service} response:`, data)
          
          // Handle different response formats
          if (service.includes('ipapi.co')) {
            if (!data.error) {
              locationData = {
                city: data.city || 'Sydney',
                region: data.region || 'New South Wales',
                country_name: data.country_name || 'Australia',
                state: data.region_code || 'NSW'
              }
              break
            }
          } else if (service.includes('ip-api.com')) {
            if (data.status === 'success') {
              locationData = {
                city: data.city || 'Sydney',
                region: data.regionName || 'New South Wales',
                country_name: data.country || 'Australia',
                state: data.region || 'NSW'
              }
              break
            }
          } else if (service.includes('ipify.org')) {
            // ipify only gives IP, so we'll use it as fallback
            locationData = {
              city: 'Sydney',
              region: 'New South Wales',
              country_name: 'Australia',
              state: 'NSW'
            }
            break
          }
        }
      } catch (serviceError) {
        console.error(`Error with service ${service}:`, serviceError)
        continue
      }
    }

    if (!locationData) {
      throw new Error('All geolocation services failed')
    }

    console.log('Final location data:', locationData)
    return NextResponse.json(locationData)
    
  } catch (error) {
    console.error('Error fetching geolocation:', error)
    
    // Return fallback data for Australia
    return NextResponse.json({
      city: 'Sydney',
      region: 'New South Wales',
      country_name: 'Australia',
      state: 'NSW'
    })
  }
} 