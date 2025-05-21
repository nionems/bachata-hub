import { useGeolocation } from './useGeolocation';

interface LocationFilterOptions {
  defaultState?: string;
  showAllOption?: boolean;
}

export function useLocationFilter<T extends { state?: string }>(
  items: T[],
  options: LocationFilterOptions = {}
) {
  const { state, isLoading, error } = useGeolocation();
  const { defaultState = 'all', showAllOption = true } = options;

  const filteredItems = items.filter(item => {
    if (isLoading || error) return true; // Show all items while loading or on error
    if (state === defaultState) return true; // Show all items when no state is selected
    return item.state === state;
  });

  const sortedItems = [...filteredItems].sort((a, b) => {
    if (isLoading || error) return 0;
    if (a.state === state && b.state !== state) return -1;
    if (a.state !== state && b.state === state) return 1;
    return 0;
  });

  return {
    items: sortedItems,
    isLoading,
    error,
    currentState: state,
    showAllOption,
  };
} 