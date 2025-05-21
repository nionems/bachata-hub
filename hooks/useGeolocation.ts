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
  'NT': { abbr: 'NT', full: 'Northern Territory' },
  // NSW Cities
  'Sydney': { abbr: 'NSW', full: 'New South Wales' },
  'Newcastle': { abbr: 'NSW', full: 'New South Wales' },
  'Wollongong': { abbr: 'NSW', full: 'New South Wales' },
  'Central Coast': { abbr: 'NSW', full: 'New South Wales' },
  'Wagga Wagga': { abbr: 'NSW', full: 'New South Wales' },
  'Albury': { abbr: 'NSW', full: 'New South Wales' },
  'Coffs Harbour': { abbr: 'NSW', full: 'New South Wales' },
  'Port Macquarie': { abbr: 'NSW', full: 'New South Wales' },
  'Tamworth': { abbr: 'NSW', full: 'New South Wales' },
  'Orange': { abbr: 'NSW', full: 'New South Wales' },
  // VIC Cities
  'Melbourne': { abbr: 'VIC', full: 'Victoria' },
  'Geelong': { abbr: 'VIC', full: 'Victoria' },
  'Ballarat': { abbr: 'VIC', full: 'Victoria' },
  'Bendigo': { abbr: 'VIC', full: 'Victoria' },
  'Shepparton': { abbr: 'VIC', full: 'Victoria' },
  'Melton': { abbr: 'VIC', full: 'Victoria' },
  'Mildura': { abbr: 'VIC', full: 'Victoria' },
  'Warrnambool': { abbr: 'VIC', full: 'Victoria' },
  'Sunbury': { abbr: 'VIC', full: 'Victoria' },
  // QLD Cities
  'Brisbane': { abbr: 'QLD', full: 'Queensland' },
  'Gold Coast': { abbr: 'QLD', full: 'Queensland' },
  'Sunshine Coast': { abbr: 'QLD', full: 'Queensland' },
  'Townsville': { abbr: 'QLD', full: 'Queensland' },
  'Cairns': { abbr: 'QLD', full: 'Queensland' },
  'Toowoomba': { abbr: 'QLD', full: 'Queensland' },
  'Mackay': { abbr: 'QLD', full: 'Queensland' },
  'Rockhampton': { abbr: 'QLD', full: 'Queensland' },
  'Bundaberg': { abbr: 'QLD', full: 'Queensland' },
  // WA Cities
  'Perth': { abbr: 'WA', full: 'Western Australia' },
  'Bunbury': { abbr: 'WA', full: 'Western Australia' },
  'Geraldton': { abbr: 'WA', full: 'Western Australia' },
  'Albany': { abbr: 'WA', full: 'Western Australia' },
  'Kalgoorlie': { abbr: 'WA', full: 'Western Australia' },
  'Broome': { abbr: 'WA', full: 'Western Australia' },
  // SA Cities
  'Adelaide': { abbr: 'SA', full: 'South Australia' },
  'Mount Gambier': { abbr: 'SA', full: 'South Australia' },
  'Whyalla': { abbr: 'SA', full: 'South Australia' },
  'Murray Bridge': { abbr: 'SA', full: 'South Australia' },
  'Port Augusta': { abbr: 'SA', full: 'South Australia' },
  // TAS Cities
  'Hobart': { abbr: 'TAS', full: 'Tasmania' },
  'Launceston': { abbr: 'TAS', full: 'Tasmania' },
  'Devonport': { abbr: 'TAS', full: 'Tasmania' },
  'Burnie': { abbr: 'TAS', full: 'Tasmania' },
  // ACT Cities
  'Canberra': { abbr: 'ACT', full: 'Australian Capital Territory' },
  // NT Cities
  'Darwin': { abbr: 'NT', full: 'Northern Territory' },
  'Alice Springs': { abbr: 'NT', full: 'Northern Territory' },
  'Palmerston': { abbr: 'NT', full: 'Northern Territory' }
}

export function useGeolocation(): GeolocationData {
  const [data, setData] = useState<GeolocationData>({
    city: '',
    region: '',
    country: '',
    state: 'all', // Default to 'all' instead of NSW
    stateFull: 'All States', // Default to 'All States'
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
        console.log('Location data:', locationData);
        
        // Check if user is in Australia
        if (locationData.country_name !== 'Australia') {
          setData({
            city: locationData.city,
            region: locationData.region,
            country: locationData.country_name,
            state: 'all',
            stateFull: 'All States',
            isLoading: false,
            error: null,
          });
          return;
        }
        
        // First try to get state from the city
        let stateInfo = STATE_MAPPING[locationData.city];
        
        // If not found, try the state
        if (!stateInfo) {
          stateInfo = STATE_MAPPING[locationData.state] || { abbr: 'all', full: 'All States' };
        }

        console.log('State info:', stateInfo);

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
          state: 'all',
          stateFull: 'All States',
        }));
      }
    };

    fetchLocation();
  }, []);

  return data;
} 