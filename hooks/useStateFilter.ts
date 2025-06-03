'use client'

import { useState, useEffect } from 'react'
import { useGeolocation } from './useGeolocation'

interface HasState {
  state: string
}

interface StateFilterOptions {
  useGeolocation?: boolean
}

/**
 * Custom hook for filtering a list of items based on a selected state.
 * 
 * @param items - Array of items that include a 'state' property
 * @param options - Configuration options including whether to use geolocation
 * @returns An object with the selectedState, a setter, and the filtered items
 */
export function useStateFilter<T extends HasState>(items: T[], options?: StateFilterOptions) {
  const { useGeolocation: shouldUseGeolocation = true } = options || {}
  const { state: geoState, isLoading: isGeoLoading, error: geoError } = useGeolocation()
  const [selectedState, setSelectedState] = useState<string>('all')

  useEffect(() => {
    if (shouldUseGeolocation && !isGeoLoading) {
      setSelectedState(geoState)
    }
  }, [geoState, isGeoLoading, shouldUseGeolocation])

  const filteredItems = isGeoLoading && shouldUseGeolocation
    ? [] // Show no items while loading if using geolocation
    : selectedState === 'all'
      ? items
      : items.filter(item => item.state === selectedState)

  return {
    selectedState,
    setSelectedState,
    filteredItems,
    isGeoLoading: shouldUseGeolocation ? isGeoLoading : false,
    error: shouldUseGeolocation ? geoError : null
  }
}
