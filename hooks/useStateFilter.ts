'use client'

import { useState, useEffect } from 'react'

interface HasState {
  state: string
}

/**
 * Custom hook for filtering a list of items based on a selected state.
 * 
 * @param items - Array of items that include a 'state' property
 * @returns An object with the selectedState, a setter, and the filtered items
 */
export function useStateFilter<T extends HasState>(items: T[]) {
  const [selectedState, setSelectedState] = useState<string>('all')
  const [filteredItems, setFilteredItems] = useState<T[]>(items)

  useEffect(() => {
    const normalizedState = selectedState.toUpperCase()

    const newFilteredItems = 
      normalizedState === 'ALL'
        ? items
        : items.filter(item => item.state?.toUpperCase() === normalizedState)

    setFilteredItems(newFilteredItems)
  }, [selectedState, items])

  return {
    selectedState,
    setSelectedState,
    filteredItems
  }
}
