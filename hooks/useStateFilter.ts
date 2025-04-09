'use client'

import { useState, useEffect } from 'react'

interface HasState {
  state: string
}

export function useStateFilter<T extends HasState>(items: T[]) {
  const [selectedState, setSelectedState] = useState<string>('all')
  const [filteredItems, setFilteredItems] = useState<T[]>(items)

  useEffect(() => {
    if (selectedState === 'all') {
      setFilteredItems(items)
    } else {
      const filtered = items.filter(item => 
        item.state?.toUpperCase() === selectedState.toUpperCase()
      )
      setFilteredItems(filtered)
    }
  }, [selectedState, items])

  return {
    selectedState,
    setSelectedState,
    filteredItems
  }
} 