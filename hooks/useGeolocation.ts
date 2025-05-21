import { useState, useEffect } from 'react'

interface GeolocationData {
  city: string;
  region: string;
  country: string;
  state: string;
  isLoading: boolean;
  error: string | null;
}

interface IpApiResponse {
  city: string;
  region: string;
  country_name: string;
  state: string;
}

const STATE_MAPPING: { [key: string]: string } = {
  // Full names
  'New South Wales': 'NSW',
  'Victoria': 'VIC',
  'Queensland': 'QLD',
  'Western Australia': 'WA',
  'South Australia': 'SA',
  'Tasmania': 'TAS',
  'Australian Capital Territory': 'ACT',
  'Northern Territory': 'NT',
  // Abbreviations
  'NSW': 'NSW',
  'VIC': 'VIC',
  'QLD': 'QLD',
  'WA': 'WA',
  'SA': 'SA',
  'TAS': 'TAS',
  'ACT': 'ACT',
  'NT': 'NT'
}

export function useGeolocation(): GeolocationData {
  const [data, setData] = useState<GeolocationData>({
    city: '',
    region: '',
    country: '',
    state: 'NSW', // Default to NSW
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const response = await fetch('https://ipapi.co/json/');
        if (!response.ok) {
          throw new Error('Failed to fetch location data');
        }

        const locationData: IpApiResponse = await response.json();
        
        // Map the state to its abbreviation
        const stateAbbr = STATE_MAPPING[locationData.state] || 'NSW'; // Default to NSW if state not found

        setData({
          city: locationData.city,
          region: locationData.region,
          country: locationData.country_name,
          state: stateAbbr,
          isLoading: false,
          error: null,
        });
      } catch (error) {
        console.error('Error fetching location:', error);
        setData(prev => ({
          ...prev,
          isLoading: false,
          error: 'Failed to detect location',
          state: 'NSW', // Default to NSW on error
        }));
      }
    };

    fetchLocation();
  }, []);

  return data;
} 