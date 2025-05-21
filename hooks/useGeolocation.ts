import { useState, useEffect } from 'react'

interface GeolocationData {
  city: string;
  region: string;
  country: string;
  state: string;
  stateFull: string;
  isLoading: boolean;
  error: string | null;
}

interface IpApiResponse {
  city: string;
  region: string;
  country_name: string;
  state: string;
}

const STATE_MAPPING: { [key: string]: { abbr: string; full: string } } = {
  // Full names
  'New South Wales': { abbr: 'NSW', full: 'New South Wales' },
  'Victoria': { abbr: 'VIC', full: 'Victoria' },
  'Queensland': { abbr: 'QLD', full: 'Queensland' },
  'Western Australia': { abbr: 'WA', full: 'Western Australia' },
  'South Australia': { abbr: 'SA', full: 'South Australia' },
  'Tasmania': { abbr: 'TAS', full: 'Tasmania' },
  'Australian Capital Territory': { abbr: 'ACT', full: 'Australian Capital Territory' },
  'Northern Territory': { abbr: 'NT', full: 'Northern Territory' },
  // Abbreviations
  'NSW': { abbr: 'NSW', full: 'New South Wales' },
  'VIC': { abbr: 'VIC', full: 'Victoria' },
  'QLD': { abbr: 'QLD', full: 'Queensland' },
  'WA': { abbr: 'WA', full: 'Western Australia' },
  'SA': { abbr: 'SA', full: 'South Australia' },
  'TAS': { abbr: 'TAS', full: 'Tasmania' },
  'ACT': { abbr: 'ACT', full: 'Australian Capital Territory' },
  'NT': { abbr: 'NT', full: 'Northern Territory' }
}

export function useGeolocation(): GeolocationData {
  const [data, setData] = useState<GeolocationData>({
    city: '',
    region: '',
    country: '',
    state: 'NSW', // Default to NSW
    stateFull: 'New South Wales', // Default to full name
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
        
        // Map the state to both abbreviation and full name
        const stateInfo = STATE_MAPPING[locationData.state] || { abbr: 'NSW', full: 'New South Wales' };

        setData({
          city: locationData.city,
          region: locationData.region,
          country: locationData.country_name,
          state: stateInfo.abbr,
          stateFull: stateInfo.full,
          isLoading: false,
          error: null,
        });
      } catch (error) {
        console.error('Error fetching location:', error);
        setData(prev => ({
          ...prev,
          isLoading: false,
          error: 'Failed to detect location',
          state: 'NSW',
          stateFull: 'New South Wales',
        }));
      }
    };

    fetchLocation();
  }, []);

  return data;
} 