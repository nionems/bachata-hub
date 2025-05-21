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

export function useGeolocation(): GeolocationData {
  const [data, setData] = useState<GeolocationData>({
    city: '',
    region: '',
    country: '',
    state: '',
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
        const stateAbbr = STATE_MAPPING[locationData.state] || locationData.state;

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
        }));
      }
    };

    fetchLocation();
  }, []);

  return data;
} 