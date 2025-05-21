'use client'

import { useState, useEffect } from 'react'
import { useGeolocation } from './useGeolocation'

interface HasState {
  state: string
}

/**
 * Custom hook for filtering a list of items based on a selected state.
 * 
 * @param items - Array of items that include a 'state' property
 * @returns An object with the selectedState, a setter, and the filtered items
 */
export function useStateFilter<T extends { state: string }>(items: T[]) {
  const { state: geoState, isLoading: isGeoLoading, error: geoError } = useGeolocation()
  const [selectedState, setSelectedState] = useState<string>('all')

  useEffect(() => {
    if (!isGeoLoading) {
      setSelectedState(geoState)
    }
  }, [geoState, isGeoLoading])

  const filteredItems = isGeoLoading
    ? [] // Show no items while loading
    : selectedState === 'all'
      ? items
      : items.filter(item => item.state === selectedState)

  return {
    selectedState,
    setSelectedState,
    filteredItems,
    isGeoLoading,
    error: geoError
  }
}
