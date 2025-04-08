'use client'

import { useState, useEffect } from 'react'

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
  const [selectedState, setSelectedState] = useState<string>('All')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchShops = async () => {
      try {
        const response = await fetch('/api/shops')
        if (!response.ok) throw new Error('Failed to fetch shops')
        const data = await response.json()
        setShops(data)
      } catch (err) {
        setError('Failed to load shops')
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchShops()
  }, [])

  const filteredShops = selectedState === 'All'
    ? shops
    : shops.filter(shop => shop.state === selectedState)

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-green-500"></div>
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
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4 text-green-900">Dance Shops</h1>
        <p className="text-gray-600 text-lg">
          Find the best dance shops in Australia for all your dance needs
        </p>
      </div>

      {/* State Filter */}
      <div className="flex justify-center flex-wrap gap-2 mb-8">
        {['All', 'NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'ACT', 'NT'].map((state) => (
          <button
            key={state}
            onClick={() => setSelectedState(state)}
            className={`px-6 py-2 rounded-full transition-colors duration-200 ${
              selectedState === state
                ? 'bg-green-600 text-white'
                : 'bg-green-100 text-green-700 hover:bg-green-200'
            }`}
          >
            {state}
          </button>
        ))}
      </div>

      {filteredShops.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          No shops found in {selectedState === 'All' ? 'any state' : selectedState}.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredShops.map((shop) => (
            <div key={shop.id} className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-transform duration-300 hover:scale-105">
              <div className="h-48 overflow-hidden">
                <img
                  src={shop.imageUrl || '/placeholder-shop.jpg'}
                  alt={shop.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-2 text-green-900">{shop.name}</h3>
                <p className="text-green-700 mb-2">
                  {shop.location}, {shop.state}
                </p>
                <p className="text-gray-600 mb-2">{shop.address}</p>
                {shop.comment && (
                  <p className="text-gray-600 mb-4 italic">{shop.comment}</p>
                )}
                <div className="flex flex-wrap gap-4 mt-4">
                  {shop.websiteLink && (
                    <a
                      href={shop.websiteLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-green-600 text-white px-4 py-2 rounded-full hover:bg-green-700 transition-colors duration-200"
                    >
                      Visit Website
                    </a>
                  )}
                  {shop.googleReviewLink && (
                    <a
                      href={shop.googleReviewLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-yellow-400 text-yellow-900 px-4 py-2 rounded-full hover:bg-yellow-500 transition-colors duration-200"
                    >
                      Read Reviews
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-16 bg-gradient-to-r from-green-600 to-yellow-400 rounded-xl shadow-xl overflow-hidden">
        <div className="p-8 md:p-12 flex flex-col md:flex-row items-center justify-between">
          <div className="text-white mb-6 md:mb-0 md:mr-8">
            <h2 className="text-3xl font-bold mb-4">
              Submit Your Dance Shop
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
              className="bg-white text-green-600 px-8 py-3 rounded-full font-semibold hover:bg-green-50 transition-colors duration-200 text-center min-w-[200px]"
            >
              Contact Us
            </a>
            <a
              href="https://forms.gle/your-google-form-link"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-yellow-400 text-green-900 px-8 py-3 rounded-full font-semibold hover:bg-yellow-500 transition-colors duration-200 text-center"
            >
              Submit via Form
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
