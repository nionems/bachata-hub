'use client'

import { useState, useEffect } from 'react'
import { Card } from "@/components/ui/card"
import { MapPin, Star, Globe, MessageSquare } from "lucide-react"
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../../firebase/config'

interface Shop {
  id: string
  name: string
  location: string
  state: string
  address: string
  googleReviewLink: string
  websiteLink: string
  imageUrl: string
  comment: string
}

export default function ShopsPage() {
  const [shops, setShops] = useState<Shop[]>([])
  const [selectedState, setSelectedState] = useState<string>('all')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Australian states array
  const states = [
    { value: 'all', label: 'All States' },
    { value: 'NSW', label: 'New South Wales' },
    { value: 'VIC', label: 'Victoria' },
    { value: 'QLD', label: 'Queensland' },
    { value: 'WA', label: 'Western Australia' },
    { value: 'SA', label: 'South Australia' },
    { value: 'TAS', label: 'Tasmania' },
    { value: 'ACT', label: 'Australian Capital Territory' },
    { value: 'NT', label: 'Northern Territory' },
  ]

  useEffect(() => {
    const fetchShops = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const shopsCollection = collection(db, 'shops')
        const shopsSnapshot = await getDocs(shopsCollection)
        const shopsList = shopsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Shop[]
        
        setShops(shopsList)
      } catch (err) {
        setError('Failed to load shops')
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchShops()
  }, [])

  const filteredShops = selectedState === 'all'
    ? shops
    : shops.filter(shop => shop.state === selectedState)

  // Handle state filter change
  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedState(e.target.value)
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-4">
        {error}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">Dance Shops</h1>
          <p className="text-xl text-gray-600">
            Find the best dance shops in Australia for all your dance needs
          </p>
        </div>

        <div className="mb-8">
          <label htmlFor="state-filter" className="block text-sm font-medium text-gray-700 mb-2">
            Filter by State
          </label>
          <select
            id="state-filter"
            value={selectedState}
            onChange={handleStateChange}
            className="mt-1 block w-full md:w-64 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            {states.map(state => (
              <option key={state.value} value={state.value}>
                {state.label}
              </option>
            ))}
          </select>
        </div>

        {filteredShops.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            No shops found {selectedState !== 'all' && `in ${states.find(s => s.value === selectedState)?.label}`}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredShops.map((shop) => (
              <ShopCard key={shop.id} shop={shop} />
            ))}
          </div>
        )}

        <div className="mt-16 bg-gradient-to-r from-primary to-secondary rounded-xl shadow-xl overflow-hidden">
          <div className="p-8 md:p-12 flex flex-col md:flex-row items-center justify-between">
            <div className="text-white mb-6 md:mb-0 md:mr-8">
              <h2 className="text-3xl font-bold mb-4">
                Submit Your Shop
              </h2>
              <p className="text-white/90 text-lg mb-6">
                Are you a dance shop owner? Get featured in our directory and reach dancers across Australia!
              </p>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                  </svg>
                  Increase your visibility in the dance community
                </li>
                <li className="flex items-center">
                  <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                  </svg>
                  Connect with dancers looking for dance wear and accessories
                </li>
                <li className="flex items-center">
                  <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                  </svg>
                  Join Australia's growing dance community
                </li>
              </ul>
            </div>
            <div className="flex flex-col space-y-4">
              <a
                href="mailto:contact@bachata.au"
                className="bg-white text-primary px-8 py-3 rounded-full font-semibold hover:bg-gray-50 transition-colors duration-200 text-center min-w-[200px]"
              >
                Contact Us
              </a>
              <a
                href="https://forms.gle/your-google-form-link"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-secondary text-white px-8 py-3 rounded-full font-semibold hover:bg-secondary/90 transition-colors duration-200 text-center"
              >
                Submit via Form
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function ShopCard({ shop }: { shop: Shop }) {
  return (
    <Card className="overflow-hidden">
      <div className="relative h-48">
        <img
          src={shop.imageUrl || '/placeholder-shop.jpg'}
          alt={shop.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            console.error('Error loading image:', shop.imageUrl);
            (e.target as HTMLImageElement).src = '/placeholder-shop.jpg';
          }}
        />
      </div>
      <div className="p-6">
        <h3 className="text-2xl font-bold mb-2 text-primary">{shop.name}</h3>
        <p className="text-gray-600 mb-2 flex items-center">
          <MapPin className="h-4 w-4 mr-1" />
          {shop.location}, {shop.state}
        </p>
        <p className="text-gray-600 mb-2">{shop.address}</p>
        {shop.comment && (
          <p className="text-gray-600 mb-4 italic flex items-start">
            <MessageSquare className="h-4 w-4 mr-1 mt-1 flex-shrink-0" />
            {shop.comment}
          </p>
        )}
        <div className="flex flex-wrap gap-4 mt-4">
          {shop.websiteLink && (
            <a
              href={shop.websiteLink}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-primary text-white px-4 py-2 rounded-full hover:bg-primary/90 transition-colors duration-200 flex items-center"
            >
              <Globe className="h-4 w-4 mr-1" />
              Visit Website
            </a>
          )}
          {shop.googleReviewLink && (
            <a
              href={shop.googleReviewLink}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-secondary text-white px-4 py-2 rounded-full hover:bg-secondary/90 transition-colors duration-200 flex items-center"
            >
              <Star className="h-4 w-4 mr-1" />
              Read Reviews
            </a>
          )}
        </div>
      </div>
    </Card>
  )
}
