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
      try {
        setIsLoading(true)
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject)
        })

        const { latitude, longitude } = position.coords

        // Use reverse geocoding to get the state
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`
        )
        const data = await response.json()

        // Extract state from address
        const stateName = data.address.state
        if (stateName && STATE_MAPPING[stateName]) {
          setState(STATE_MAPPING[stateName])
        }
      } catch (err) {
        console.error('Error getting location:', err)
        setError('Could not get your location')
      } finally {
        setIsLoading(false)
      }
    }

    getLocation()
  }, [])

  return { state, isLoading, error }
} 