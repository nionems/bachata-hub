import React, { useState, useEffect, useRef, useMemo } from 'react'
import { Festival } from '@/types/festival'
import { LazyFestivalCard } from './LazyFestivalCard'

interface VirtualizedFestivalGridProps {
  festivals: Festival[]
  onImageClick: (e: React.MouseEvent, festival: Festival) => void
  expandedDescriptions: { [key: string]: boolean }
  toggleDescription: (festivalId: string) => void
  dateHelpers: any
  className?: string
}

const ITEM_HEIGHT = 400 // Approximate height of each festival card
const BUFFER_SIZE = 5 // Number of items to render outside viewport

export function VirtualizedFestivalGrid({
  festivals,
  onImageClick,
  expandedDescriptions,
  toggleDescription,
  dateHelpers,
  className = ""
}: VirtualizedFestivalGridProps) {
  const [scrollTop, setScrollTop] = useState(0)
  const [containerHeight, setContainerHeight] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  // Calculate visible range
  const visibleRange = useMemo(() => {
    const startIndex = Math.max(0, Math.floor(scrollTop / ITEM_HEIGHT) - BUFFER_SIZE)
    const endIndex = Math.min(
      festivals.length - 1,
      Math.ceil((scrollTop + containerHeight) / ITEM_HEIGHT) + BUFFER_SIZE
    )
    return { startIndex, endIndex }
  }, [scrollTop, containerHeight, festivals.length])

  // Get visible items
  const visibleItems = useMemo(() => {
    return festivals.slice(visibleRange.startIndex, visibleRange.endIndex + 1)
  }, [festivals, visibleRange])

  // Calculate total height
  const totalHeight = festivals.length * ITEM_HEIGHT

  // Handle scroll
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop)
  }

  // Update container height on mount and resize
  useEffect(() => {
    const updateHeight = () => {
      if (containerRef.current) {
        setContainerHeight(containerRef.current.clientHeight)
      }
    }

    updateHeight()
    window.addEventListener('resize', updateHeight)
    return () => window.removeEventListener('resize', updateHeight)
  }, [])

  if (festivals.length === 0) {
    return (
      <div className={`text-center py-8 text-gray-500 ${className}`}>
        No festivals found
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className={`overflow-auto ${className}`}
      style={{ height: '70vh' }}
      onScroll={handleScroll}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        {visibleItems.map((festival, index) => {
          const actualIndex = visibleRange.startIndex + index
          const top = actualIndex * ITEM_HEIGHT

          return (
            <div
              key={festival.id}
              style={{
                position: 'absolute',
                top,
                left: 0,
                right: 0,
                height: ITEM_HEIGHT,
                padding: '0.5rem'
              }}
            >
              <LazyFestivalCard
                festival={festival}
                onImageClick={onImageClick}
                expandedDescriptions={expandedDescriptions}
                toggleDescription={toggleDescription}
                dateHelpers={dateHelpers}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}
