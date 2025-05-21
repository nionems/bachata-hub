import { useGeolocation } from '@/hooks/useGeolocation';

export function LocationStatus() {
  const { city, state, stateFull, isLoading, error } = useGeolocation();

  if (isLoading) {
    return (
      <div className="text-sm text-gray-500">
        Detecting your location...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-sm text-gray-500">
        Showing all locations
      </div>
    );
  }

  return (
    <div className="text-sm text-gray-500">
      Showing content for {city}, {stateFull} ({state})
    </div>
  );
} 