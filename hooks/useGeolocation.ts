import { useState, useEffect } from 'react'

const STATE_MAPPING: { [key: string]: string } = {
  'New South Wales': 'NSW',
  'NSW': 'NSW',
  'Victoria': 'VIC',
  'VIC': 'VIC',
  'Queensland': 'QLD',
  'QLD': 'QLD',
  'Western Australia': 'WA',
  'WA': 'WA',
  'South Australia': 'SA',
  'SA': 'SA',
  'Tasmania': 'TAS',
  'TAS': 'TAS',
  'Australian Capital Territory': 'ACT',
  'ACT': 'ACT',
  'Northern Territory': 'NT',
  'NT': 'NT'
}

export function useGeolocation() {
  const [state, setState] = useState<string>('all')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const getLocation = async () => {
      if (!navigator.geolocation) {
        setError('Geolocation is not supported by your browser')
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(
            resolve,
            (error) => {
              switch (error.code) {
                case error.PERMISSION_DENIED:
                  reject(new Error('Please enable location access to see content from your state'))
                  break
                case error.POSITION_UNAVAILABLE:
                  reject(new Error('Location information is unavailable'))
                  break
                case error.TIMEOUT:
                  reject(new Error('Location request timed out'))
                  break
                default:
                  reject(new Error('An unknown error occurred'))
              }
            },
            {
              enableHighAccuracy: true,
              timeout: 10000,
              maximumAge: 0
            }
          )
        })

        const { latitude, longitude } = position.coords

        // Use reverse geocoding to get the state
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`,
          {
            headers: {
              'Accept-Language': 'en-US,en;q=0.9',
              'User-Agent': 'BachataHub/1.0'
            }
          }
        )

        if (!response.ok) {
          throw new Error('Failed to get location details')
        }

        const data = await response.json()

        // Extract state from address
        const stateName = data.address.state
        if (stateName && STATE_MAPPING[stateName]) {
          setState(STATE_MAPPING[stateName])
        } else {
          setError('Could not determine your state')
        }
      } catch (err) {
        console.error('Error getting location:', err)
        setError(err instanceof Error ? err.message : 'Could not get your location')
      } finally {
        setIsLoading(false)
      }
    }

    getLocation()
  }, [])

  return { state, isLoading, error }
} 