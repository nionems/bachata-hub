'use client'

import { useState } from 'react'
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, Share, Instagram, Facebook, MapPin, Tag, X, ChevronDown, ChevronUp } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { Shop } from "@/types/shop"

interface ShopCardProps {
  shop: Shop
}

export function ShopCard({ shop }: ShopCardProps) {
  const [isImageModalOpen, setIsImageModalOpen] = useState(false)
  const [isInfoExpanded, setIsInfoExpanded] = useState(false)

  // Debug log to see shop data
  console.log('Shop data:', { name: shop.name, info: shop.info, infoLength: shop.info?.length })

  const handleImageClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (shop.imageUrl) {
      setIsImageModalOpen(true);
    }
  }

  return (
    <>
      <Card className="relative overflow-hidden group cursor-pointer h-[250px] sm:h-[300px]">
        <div 
          className="aspect-w-16 aspect-h-9 relative h-[250px] sm:h-[300px] cursor-pointer"
          onClick={handleImageClick}
        >
          <img
            src={shop.imageUrl}
            alt={shop.name}
            className="object-cover w-full h-full hover:scale-105 transition-transform duration-200"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
          
          {/* Top section - Price and Discount Code */}
          <div className="absolute top-0 left-0 right-0 z-10 p-2 sm:p-3">
            <div className="flex items-start justify-between">
              {shop.price && (
                <div className="bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-500 text-gray-800 px-2 py-1 rounded-lg text-sm font-bold shadow-xl transform -rotate-3 hover:rotate-0 hover:scale-110 transition-all duration-300 border-2 border-yellow-200 opacity-85 hover:opacity-100">
                  <div className="flex items-center gap-1 relative">
                    <span className="drop-shadow-sm">{shop.price}</span>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-white/40 to-transparent rounded-lg opacity-50"></div>
                </div>
              )}
              {shop.discountCode && (
                <div className="bg-gradient-to-r from-primary via-primary/90 to-secondary text-white px-2 py-1 rounded-full text-xs font-bold shadow-xl transform rotate-3 hover:rotate-0 hover:scale-110 transition-all duration-300 flex items-center gap-1 border-2 border-white/20 backdrop-blur-sm">
                  <Tag className="h-3 w-3 drop-shadow-sm" />
                  <span className="drop-shadow-sm">{shop.discountCode}</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-full opacity-50"></div>
                </div>
              )}
            </div>
          </div>

          {/* Middle section - Clickable area with subtle hint */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <div className="bg-white/20 backdrop-blur-sm rounded-full p-2">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
              </svg>
            </div>
          </div>

          {/* Bottom section - Compact info */}
          <div className="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-2 sm:p-3">
            <h3 className="text-sm sm:text-base font-semibold text-white line-clamp-1 mb-1">{shop.name}</h3>
            <div className="flex items-center gap-1 sm:gap-2 text-[10px] text-gray-200 mb-1">
              <MapPin className="h-3 w-3 flex-shrink-0" />
              <span className="line-clamp-1">{shop.location}</span>
            </div>
            
            {/* Compact action buttons */}
            <div className="flex items-center justify-between gap-1">
              <div className="flex gap-1 items-center">
                {shop.website && (
                  <a
                    href={shop.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="p-1.5 bg-primary/20 hover:bg-primary/30 text-primary rounded-full transition-colors duration-200"
                    title="Website"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                )}
                {!shop.website && shop.instagramUrl && (
                  <a
                    href={shop.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="p-1.5 bg-primary/20 hover:bg-primary/30 text-primary rounded-full transition-colors duration-200"
                    title="Instagram"
                  >
                    <Instagram className="h-4 w-4" />
                  </a>
                )}
                {!shop.website && !shop.instagramUrl && shop.facebookUrl && (
                  <a
                    href={shop.facebookUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="p-1.5 bg-primary/20 hover:bg-primary/30 text-primary rounded-full transition-colors duration-200"
                    title="Facebook"
                  >
                    <Facebook className="h-4 w-4" />
                  </a>
                )}
              </div>
              <div className="flex gap-1 items-center">
                <div
                  className="p-1.5 bg-primary/20 hover:bg-primary/30 text-primary rounded-full transition-colors duration-200 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (navigator.share) {
                      navigator.share({
                        title: shop.name,
                        text: `Check out ${shop.name} - ${shop.location}`,
                        url: shop.website || window.location.href
                      });
                    } else {
                      navigator.clipboard.writeText(shop.website || window.location.href);
                      toast({
                        title: "Link copied to clipboard",
                        description: "Share this shop's website with your friends!",
                      });
                    }
                  }}
                  title="Share"
                >
                  <Share className="h-4 w-4" />
                </div>
                {shop.googleMapLink && (
                  <a
                    href={shop.googleMapLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="p-1.5 bg-primary/20 hover:bg-primary/30 text-primary rounded-full transition-colors duration-200"
                    title="Map"
                  >
                    <MapPin className="h-4 w-4" />
                  </a>
                )}
              </div>
            </div>

            {/* Comment badge - only show if there's space */}
            {shop.comment && (
              <div className="mt-1">
                <Badge variant="secondary" className="bg-white/90 text-secondary border-secondary/30 text-xs font-medium">
                  {shop.comment}
                </Badge>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Image Modal */}
      {isImageModalOpen && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setIsImageModalOpen(false)}
        >
          <button
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
            onClick={() => setIsImageModalOpen(false)}
          >
            <X className="h-8 w-8" />
          </button>
          <img
            src={shop.imageUrl}
            alt={shop.name}
            className="max-h-[90vh] max-w-[90vw] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  )
} 