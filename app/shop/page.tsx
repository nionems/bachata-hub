'use client'

import { useState, useEffect } from 'react'
import { Card, CardFooter } from "@/components/ui/card"
import { MapPin, Star, Globe, MessageSquare, ExternalLink, Instagram, Facebook, Share } from "lucide-react"
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../../firebase/config'
import { ContactForm } from "@/components/ContactForm"
import { ShopSubmissionForm } from "@/components/ShopSubmissionForm"
import { Button } from "@/components/ui/button"
import { StateFilter } from "@/components/StateFilter"
import { ImageModal } from "@/components/ImageModal"
import { toast } from "@/components/ui/use-toast"
import { ShopCard } from '@/components/ShopCard'
import { useStateFilter } from '@/hooks/useStateFilter'
import { Shop } from '@/types/shop'
import { LoadingSpinner } from '@/components/loading-spinner'

export default function ShopsPage() {
  const [shops, setShops] = useState<Shop[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isContactFormOpen, setIsContactFormOpen] = useState(false)
  const [isSubmissionFormOpen, setIsSubmissionFormOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState<{ url: string; title: string } | null>(null)

  const { selectedState, setSelectedState, filteredItems: filteredShops } = useStateFilter(shops)

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
        console.error('Error fetching shops:', err)
        setError('Failed to load shops')
      } finally {
        setIsLoading(false)
      }
    }

    fetchShops()
  }, [])

  const handleStateChange = (value: string) => {
    setSelectedState(value)
  }

  if (isLoading) {
    return <LoadingSpinner message="Loading shops..." />
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-red-500">
        {error}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
        <div className="text-center mb-4 sm:mb-12">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2 sm:mb-4">
            Dance Shops
          </h1>
          <p className="text-base sm:text-xl text-gray-600">
            Shop HERE & support BACHATA.AU
          </p>
        </div>

        <div className="mb-4 sm:mb-8">
          <StateFilter
            selectedState={selectedState}
            onChange={setSelectedState}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {filteredShops.length === 0 ? (
            <div className="col-span-full text-center py-6 sm:py-8 text-gray-500">
              No shops found {selectedState !== 'all' && `in ${selectedState}`}
            </div>
          ) : (
            filteredShops.map((shop) => (
              <ShopCard key={shop.id} shop={shop} />
            ))
          )}
        </div>

        {/* Submit Your Shop Card */}
        <div className="mt-8 sm:mt-16 bg-gradient-to-r from-primary to-secondary rounded-xl shadow-xl overflow-hidden">
          <div className="p-4 sm:p-8 md:p-12 flex flex-col md:flex-row items-center justify-between">
            <div className="text-white mb-4 sm:mb-6 md:mb-0 md:mr-8">
              <h2 className="text-xl sm:text-3xl font-bold mb-2 sm:mb-4">
                Submit Your Shop
              </h2>
              <p className="text-white/90 text-sm sm:text-lg mb-3 sm:mb-6">
                Are you a dance shop owner? Get featured in our directory and reach dancers across Australia!
              </p>
              <ul className="space-y-1 sm:space-y-3">
                <li className="flex items-center text-sm sm:text-base">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                  </svg>
                  Reach a wider audience of dance enthusiasts
                </li>
                <li className="flex items-center text-sm sm:text-base">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                  </svg>
                  Promote your products to the dance community
                </li>
                <li className="flex items-center text-sm sm:text-base">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                  </svg>
                  Connect with dancers across Australia
                </li>
              </ul>
            </div>
            <div className="flex flex-col space-y-3 sm:space-y-4 w-full sm:w-auto">
              <Button
                onClick={() => setIsContactFormOpen(true)}
                className="bg-white text-primary px-6 sm:px-8 py-2 sm:py-3 rounded-full font-semibold hover:bg-gray-50 transition-colors duration-200 text-center w-full sm:w-auto"
              >
                Contact Us
              </Button>
              <Button
                onClick={() => setIsSubmissionFormOpen(true)}
                className="bg-secondary text-white px-6 sm:px-8 py-2 sm:py-3 rounded-full font-semibold hover:bg-secondary/90 transition-colors duration-200 text-center w-full sm:w-auto"
              >
                Submit via Form
              </Button>
            </div>
          </div>
        </div>

        {/* Image Modal */}
        <ImageModal
          isOpen={!!selectedImage}
          onClose={() => setSelectedImage(null)}
          imageUrl={selectedImage?.url || ''}
          title={selectedImage?.title || ''}
        />

        <ContactForm
          isOpen={isContactFormOpen}
          onClose={() => setIsContactFormOpen(false)}
        />

        <ShopSubmissionForm
          isOpen={isSubmissionFormOpen}
          onClose={() => setIsSubmissionFormOpen(false)}
        />
      </div>
    </div>
  )
}