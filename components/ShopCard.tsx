'use client'

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Instagram, Facebook, MapPin, Tag, Info } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { Shop } from "@/types/shop"

interface ShopCardProps {
  shop: Shop
}

export function ShopCard({ shop }: ShopCardProps) {
  const [isInfoOpen, setIsInfoOpen] = useState(false)
  const [isImageOpen, setIsImageOpen] = useState(false)

  // Debug log to see shop data - especially for sasarosa
  if (shop.name?.toLowerCase().includes('sasarosa')) {
    console.log('🔍 SARASOSA SHOP DEBUG:', { 
      name: shop.name, 
      discountCode: shop.discountCode, 
      hasDiscountCode: !!shop.discountCode,
      discountCodeType: typeof shop.discountCode,
      discountCodeLength: shop.discountCode?.length,
      discountCodeTrimmed: shop.discountCode?.trim(),
      willShow: shop.discountCode && shop.discountCode.trim() !== '',
      fullShop: shop
    })
  }

  const handleImageClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (shop.website) {
      // If website exists, open website
      window.open(shop.website, '_blank', 'noopener,noreferrer');
    } else {
      // If no website, open image in modal
      setIsImageOpen(true);
    }
  }

  const hasInfo = shop.info && shop.info.trim().length > 0
  const hasWebsite = shop.website && shop.website.trim().length > 0

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
              {shop.discountCode && typeof shop.discountCode === 'string' && shop.discountCode.trim().length > 0 && (
                <div className="bg-gradient-to-r from-primary via-primary/90 to-secondary text-white px-2 py-1 rounded-full text-xs font-bold shadow-xl transform rotate-3 hover:rotate-0 hover:scale-110 transition-all duration-300 flex items-center gap-1 border-2 border-white/20 backdrop-blur-sm">
                  <Tag className="h-3 w-3 drop-shadow-sm" />
                  <span className="drop-shadow-sm">{shop.discountCode.trim()}</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-full opacity-50"></div>
                </div>
              )}
            </div>
          </div>

          {/* Middle section - Clickable area with subtle hint */}
          {hasWebsite ? (
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <div className="bg-white/20 backdrop-blur-sm rounded-full p-2">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </div>
            </div>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <div className="bg-white/20 backdrop-blur-sm rounded-full p-2">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                </svg>
              </div>
            </div>
          )}

          {/* Bottom section - Compact info */}
          <div className="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-2 sm:p-3">
            <h3 className="text-sm sm:text-base font-semibold text-white line-clamp-1 mb-2">{shop.name}</h3>
            
            {/* Compact action buttons */}
            <div className="flex items-center justify-between gap-1">
              <div className="flex gap-1 items-center">
                {hasInfo && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsInfoOpen(true);
                    }}
                    className="p-1.5 bg-primary/20 hover:bg-primary/30 text-primary rounded-full transition-colors duration-200"
                    title="More Info"
                  >
                    <Info className="h-4 w-4" />
                  </button>
                )}
                {shop.instagramUrl && (
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
                {shop.facebookUrl && (
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
                <button
                  className="px-3 py-1.5 bg-primary/20 hover:bg-primary/30 text-primary rounded-md border border-primary/30 hover:border-primary/50 transition-all duration-200 text-xs font-medium shadow-sm hover:shadow cursor-pointer"
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
                  Share
                </button>
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

      {/* Info Dialog */}
      {hasInfo && (
        <Dialog open={isInfoOpen} onOpenChange={setIsInfoOpen}>
          <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{shop.name}</DialogTitle>
              <DialogDescription>
                {shop.location}, {shop.state}
              </DialogDescription>
            </DialogHeader>
            <div className="mt-4">
              <h4 className="font-semibold mb-2 text-sm text-gray-700">Additional Information:</h4>
              <p className="text-sm text-gray-600 whitespace-pre-wrap">{shop.info}</p>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Image Dialog - Only shown when there's no website */}
      {!hasWebsite && (
        <Dialog open={isImageOpen} onOpenChange={setIsImageOpen}>
          <DialogContent className="max-w-[95vw] sm:max-w-6xl max-h-[95vh] overflow-hidden p-0 bg-black/95 border-none [&>button]:text-white [&>button]:hover:bg-white/20 [&>button]:hover:opacity-100">
            <DialogHeader className="p-4 sm:p-6 pb-2 bg-black/50">
              <DialogTitle className="text-white text-lg sm:text-xl">{shop.name}</DialogTitle>
              <DialogDescription className="text-gray-300">
                {shop.location}, {shop.state}
              </DialogDescription>
            </DialogHeader>
            <div className="flex items-center justify-center p-2 sm:p-4 overflow-auto max-h-[calc(95vh-100px)]">
              <img
                src={shop.imageUrl}
                alt={shop.name}
                className="max-w-full max-h-[85vh] w-auto h-auto object-contain rounded-lg shadow-2xl cursor-default"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  )
} 