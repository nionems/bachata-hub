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

interface GeolocationState {
  latitude: number | null;
  longitude: number | null;
  error: string | null;
  isLoading: boolean;
}

export function useGeolocation() {
  const [state, setState] = useState<GeolocationState>({
    latitude: null,
    longitude: null,
    error: null,
    isLoading: true,
  });

  useEffect(() => {
    if (!navigator.geolocation) {
      setState(prev => ({
        ...prev,
        error: 'Geolocation is not supported by your browser',
        isLoading: false,
      }));
      return;
    }

    // Check if we're in Safari
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          error: null,
          isLoading: false,
        });
      },
      (error) => {
        let errorMessage = 'Unable to retrieve your location';
        
        // Provide more specific error messages based on the error code
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = isSafari 
              ? 'Please allow location access in the system prompt to find events near you'
              : 'Please allow location access to find events near you';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information is unavailable';
            break;
          case error.TIMEOUT:
            errorMessage = 'The request to get your location timed out';
            break;
        }

        setState(prev => ({
          ...prev,
          error: errorMessage,
          isLoading: false,
        }));
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      }
    );
  }, []);

  return state;
} 