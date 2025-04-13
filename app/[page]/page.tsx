'use client'

import { useState, useEffect } from 'react'
import { StateFilter } from '@/components/ui/StateFilter'
import { useStateFilter } from '@/hooks/useStateFilter'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../../firebase/config'
import { ItemCard } from '@/components/ItemCard'

// Replace ItemType with the appropriate interface (e.g., Festival, Instructor, DJ)
export default function PageName() {
  const [items, setItems] = useState<ItemType[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const { selectedState, setSelectedState, filteredItems } = useStateFilter(items)

  useEffect(() => {
    const fetchItems = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const itemsCollection = collection(db, 'collection-name')
        const itemsSnapshot = await getDocs(itemsCollection)
        const itemsList = itemsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as ItemType[]

        setItems(itemsList)
      } catch (err) {
        console.error('Error fetching items:', err)
        setError('Failed to load items')
      } finally {
        setIsLoading(false)
      }
    }

    fetchItems()
  }, [])

  if (isLoading) return <div className="text-center py-8">Loading...</div>
  if (error) return <div className="text-center py-8 text-red-500">{error}</div>

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="text-center mb-8 mt-2 sm:mt-4">
          <h1 className="text-xl sm:text-2xl md:text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2 sm:mb-4">
            Bachata [Page Name]
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Find Bachata [items] across Australia
          </p>
        </div>

        {/* State Filter Component */}
        <StateFilter
          selectedState={selectedState}
          onChange={setSelectedState}
        />

        {/* Grid of filtered items */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.length === 0 ? (
            <div className="col-span-full text-center py-8 text-gray-500">
              No items found {selectedState !== 'all' && `in ${selectedState}`}
            </div>
          ) : (
            filteredItems.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))
          )}
        </div>
      </div>
    </div>
  )
}
