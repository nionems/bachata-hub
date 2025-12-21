'use client'

import { useState, useEffect } from 'react'
import { Card, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MapPin, Star, Globe, MessageSquare, ExternalLink, Instagram, Facebook, Share, RefreshCw, Search, X, ArrowUpDown } from "lucide-react"
import { ContactForm } from "@/components/ContactForm"
import { ShopSubmissionForm } from "@/components/ShopSubmissionForm"
import { Button } from "@/components/ui/button"
import { ImageModal } from "@/components/ImageModal"
import { toast } from "@/components/ui/use-toast"
import { ShopCard } from '@/components/ShopCard'
import { Shop } from '@/types/shop'
import { LoadingSpinner } from '@/components/loading-spinner'
import { DANCE_STYLES } from '@/lib/constants'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

export default function ShopsPage() {
  const [shops, setShops] = useState<Shop[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isContactFormOpen, setIsContactFormOpen] = useState(false)
  const [isSubmissionFormOpen, setIsSubmissionFormOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState<{ url: string; title: string } | null>(null)
  const [activeTab, setActiveTab] = useState("new")
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState<"name" | "location" | "none">("none")

    const fetchShops = async () => {
      setIsLoading(true)
      setError(null)
      try {
      // Use cache with revalidation for better performance
      // Cache for 30 seconds to balance freshness and speed
      const response = await fetch('/api/shops', {
        next: { revalidate: 30 }
      })
        if (!response.ok) {
          throw new Error('Failed to fetch shops')
        }
        const shopsList = await response.json()
        setShops(shopsList)
      setLastUpdated(new Date())
      } catch (err) {
        console.error('Error fetching shops:', err)
        setError('Failed to load shops')
      } finally {
        setIsLoading(false)
      }
    }

  useEffect(() => {
    fetchShops()
  }, [])

  // Filter and sort shops
  const filterAndSortShops = (shops: Shop[]) => {
    let filtered = shops

    // Filter by search term
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(shop => 
        shop.name.toLowerCase().includes(term) ||
        shop.location.toLowerCase().includes(term) ||
        shop.comment?.toLowerCase().includes(term)
      )
    }

    // Sort shops
    if (sortBy === "name") {
      filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name))
    } else if (sortBy === "location") {
      filtered = [...filtered].sort((a, b) => a.location.localeCompare(b.location))
    }

    return filtered
  }
  
  const newShops = filterAndSortShops(shops.filter(shop => shop.condition === 'New'))
  const secondHandShops = filterAndSortShops(shops.filter(shop => shop.condition === 'Second Hand'))
  
  const totalShops = shops.length
  const filteredCount = activeTab === "new" ? newShops.length : secondHandShops.length
  const hasActiveFilters = searchTerm.trim() !== '' || sortBy !== 'none'

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
        <div className="mb-6 sm:mb-8 space-y-4">
          {/* Filters and Search */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <div className="flex gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-[250px]">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search shops..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-10 bg-white border-gray-200 focus:border-primary focus:ring-primary rounded-md"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
              <Select value={sortBy} onValueChange={(value: "name" | "location" | "none") => setSortBy(value)}>
                <SelectTrigger className="w-full sm:w-[180px] bg-white border-gray-200 focus:border-primary focus:ring-primary rounded-md">
                  <div className="flex items-center gap-2">
                    <ArrowUpDown className="h-4 w-4 text-gray-400" />
                    <SelectValue placeholder="Sort by" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No sorting</SelectItem>
                  <SelectItem value="name">Name (A-Z)</SelectItem>
                  <SelectItem value="location">Location</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Active Filters Display */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2 px-4 py-2 bg-white rounded-lg border border-gray-200 shadow-sm">
              <span className="text-sm text-gray-600 font-medium">Filters:</span>
              {searchTerm && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Search: "{searchTerm}"
                  <button
                    onClick={() => setSearchTerm("")}
                    className="ml-1 hover:text-red-500"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              {sortBy !== 'none' && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Sort: {sortBy === 'name' ? 'Name' : 'Location'}
                  <button
                    onClick={() => setSortBy('none')}
                    className="ml-1 hover:text-red-500"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              <button
                onClick={() => {
                  setSearchTerm('')
                  setSortBy('none')
                }}
                className="text-sm text-primary hover:underline ml-auto"
              >
                Clear all
              </button>
            </div>
          )}

          {/* Stats and Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg p-4 border border-primary/10">
            <div className="text-center sm:text-left">
              <p className="text-sm font-medium bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Always Mention ❤️ BACHATAAU ❤️
              </p>
              <p className="text-xs text-gray-600 mt-1">
                Showing {filteredCount} of {totalShops} {activeTab === "new" ? "new" : "second hand"} items
                {hasActiveFilters && ` (filtered)`}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <Button
                onClick={() => setIsSubmissionFormOpen(true)}
                className="bg-gradient-to-r from-primary to-secondary text-white px-6 py-2 rounded-full font-semibold hover:opacity-90 transition-all duration-200 shadow-lg w-full sm:w-auto"
              >
                Add Listing
              </Button>
              <Button
                onClick={fetchShops}
                variant="outline"
                className="px-4 py-2 rounded-full font-semibold hover:bg-gray-100 transition-all duration-200 w-full sm:w-auto"
                disabled={isLoading}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
            <p className="text-xs text-gray-500 text-center sm:text-right">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </p>
          </div>
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
            {newShops.length === 0 ? (
              <div className="col-span-full text-center py-12 sm:py-16">
                <div className="max-w-md mx-auto">
                  <div className="mb-4">
                    <Search className="h-16 w-16 mx-auto text-gray-300" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">
                    {hasActiveFilters ? "No items match your filters" : "No new items available"}
                  </h3>
                  <p className="text-gray-500 mb-6">
                    {hasActiveFilters 
                      ? "Try adjusting your filters or search terms to find more items."
                      : "Check back soon for new listings!"}
                  </p>
                  {hasActiveFilters && (
                    <Button
                      onClick={() => {
                        setSearchTerm('')
                        setSortBy('none')
                      }}
                      variant="outline"
                      className="rounded-full"
                    >
                      Clear Filters
                    </Button>
                  )}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4 md:gap-6">
                {newShops.map((shop) => (
                  <ShopCard key={shop.id} shop={shop} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="second-hand" className="mt-0">
            {secondHandShops.length === 0 ? (
              <div className="col-span-full text-center py-12 sm:py-16">
                <div className="max-w-md mx-auto">
                  <div className="mb-4">
                    <Search className="h-16 w-16 mx-auto text-gray-300" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">
                    {hasActiveFilters ? "No items match your filters" : "No second hand items available"}
                  </h3>
                  <p className="text-gray-500 mb-6">
                    {hasActiveFilters 
                      ? "Try adjusting your filters or search terms to find more items."
                      : "Check back soon for second hand listings!"}
                  </p>
                  {hasActiveFilters && (
                    <Button
                      onClick={() => {
                        setSearchTerm('')
                        setSortBy('none')
                      }}
                      variant="outline"
                      className="rounded-full"
                    >
                      Clear Filters
                    </Button>
                  )}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4 md:gap-6">
                {secondHandShops.map((shop) => (
                  <ShopCard key={shop.id} shop={shop} />
                ))}
              </div>
            )}
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
                Add Listing
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