'use client'

import { useState, useEffect } from 'react'
import { Card, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MapPin, Star, Globe, MessageSquare, ExternalLink, Instagram, Facebook, Share } from "lucide-react"
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../../firebase/config'
import { ContactForm } from "@/components/ContactForm"
import { ShopSubmissionForm } from "@/components/ShopSubmissionForm"
import { Button } from "@/components/ui/button"
import { ImageModal } from "@/components/ImageModal"
import { toast } from "@/components/ui/use-toast"
import { ShopCard } from '@/components/ShopCard'
import { Shop } from '@/types/shop'
import { LoadingSpinner } from '@/components/loading-spinner'
import { StateFilter } from "@/components/StateFilter"

export default function ShopsPage() {
  const [shops, setShops] = useState<Shop[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isContactFormOpen, setIsContactFormOpen] = useState(false)
  const [isSubmissionFormOpen, setIsSubmissionFormOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState<{ url: string; title: string } | null>(null)
  const [activeTab, setActiveTab] = useState("new")
  const [selectedState, setSelectedState] = useState("all")

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

  // Filter shops by condition and state
  const filterByState = (shops: Shop[]) =>
    selectedState && selectedState !== 'all' ? shops.filter(shop => shop.state === selectedState) : shops
  const newShops = filterByState(shops.filter(shop => shop.condition === 'New'))
  const secondHandShops = filterByState(shops.filter(shop => shop.condition === 'Second Hand'))

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
            Marketplace
          </h1>
          <p className="text-base sm:text-xl text-gray-600">
          Use code BACHATAAU at checkout — every purchase helps support and grow Bachata.au for the Australian dance community!
          </p>
        </div>
        <div className="mb-4 sm:mb-8">
          <StateFilter selectedState={selectedState} onChange={setSelectedState} />
        </div>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6 sm:mb-8">
            <TabsTrigger value="new" className="text-sm sm:text-base font-semibold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-secondary data-[state=active]:bg-clip-text data-[state=active]:text-transparent">
              New ({newShops.length})
            </TabsTrigger>
            <TabsTrigger value="second-hand" className="text-sm sm:text-base font-semibold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-secondary data-[state=active]:bg-clip-text data-[state=active]:text-transparent">
              Second Hand ({secondHandShops.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="new" className="mt-0">
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4 md:gap-6">
              {newShops.length === 0 ? (
                <div className="col-span-full text-center py-6 sm:py-8 text-gray-500">
                  No new items found
                </div>
              ) : (
                newShops.map((shop) => (
                  <ShopCard key={shop.id} shop={shop} />
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="second-hand" className="mt-0">
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4 md:gap-6">
              {secondHandShops.length === 0 ? (
                <div className="col-span-full text-center py-6 sm:py-8 text-gray-500">
                  No second hand items found
                </div>
              ) : (
                secondHandShops.map((shop) => (
                  <ShopCard key={shop.id} shop={shop} />
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* Submit Your Shop Card */}
        <div className="mt-8 sm:mt-16 bg-gradient-to-r from-primary to-secondary rounded-xl shadow-xl overflow-hidden">
          <div className="p-4 sm:p-8 md:p-12 flex flex-col md:flex-row items-center justify-between">
            <div className="text-white mb-2 sm:mb-6 md:mb-0 md:mr-8">
              <h2 className="text-xl sm:text-3xl font-bold mb-2 sm:mb-4">
                Submit Shop New or SecondHand
              </h2>
              <p className="text-white/90 text-sm sm:text-lg mb-3 sm:mb-6">
                Are you a dance shop owner? Get featured in our directory and reach dancers across Australia!
              </p>
              <ul className="space-y-1 sm:space-y-3">
                <li className="flex items-center text-sm sm:text-base">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                  </svg>
                  List brand new/second-hand products here.
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