'use client'

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, Share, Instagram, Facebook, MapPin, Tag } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { Shop } from "@/types/shop"

interface ShopCardProps {
  shop: Shop
}

export function ShopCard({ shop }: ShopCardProps) {
  const handleImageClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (shop.website) {
      window.open(shop.website, '_blank');
    }
  }

  return (
    <Card className="relative overflow-hidden group cursor-pointer h-[250px] sm:h-[300px]">
      <div className="aspect-w-16 aspect-h-9 relative h-[250px] sm:h-[300px]">
        <img
          src={shop.imageUrl}
          alt={shop.name}
          className="object-cover w-full h-full cursor-pointer"
          onClick={handleImageClick}
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
        {shop.price && (
          <div className="absolute top-4 left-4 bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-500 text-gray-800 px-3 py-1 rounded-lg text-base font-bold shadow-xl transform -rotate-3 hover:rotate-0 hover:scale-110 transition-all duration-300 z-10 border-2 border-yellow-200">
            <div className="flex items-center gap-1 relative">
              <span className="drop-shadow-sm">{shop.price}</span>
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-white/40 to-transparent rounded-lg opacity-50"></div>
          </div>
        )}
        {shop.discountCode && (
          <div className="absolute top-4 right-4 bg-gradient-to-r from-primary via-primary/90 to-secondary text-white px-4 py-2 rounded-full text-sm font-bold shadow-xl transform rotate-3 hover:rotate-0 hover:scale-110 transition-all duration-300 flex items-center gap-2 border-2 border-white/20 backdrop-blur-sm hidden sm:flex">
            <Tag className="h-4 w-4 drop-shadow-sm" />
            <span className="drop-shadow-sm">{shop.discountCode}</span>
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-full opacity-50"></div>
          </div>
        )}
      </div>

      <div className="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3 sm:p-4">
        <h3 className="text-base sm:text-lg font-semibold text-white line-clamp-1">{shop.name}</h3>
        <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-200 mt-1">
          <MapPin className="h-3 w-3 sm:h-4 sm:w-4 hidden sm:block" />
          <span className="line-clamp-1 hidden sm:inline">{shop.location}</span>
        </div>
        {shop.comment && (
          <div className="mt-1">
            <Badge variant="secondary" className="bg-white/90 text-secondary border-secondary/30 text-xs font-medium">
              {shop.comment}
            </Badge>
          </div>
        )}
        {shop.discountCode && (
          <div className="mt-1 sm:hidden">
            <div className="inline-flex items-center gap-1 bg-gradient-to-r from-primary/90 to-secondary/90 text-white px-2 py-1 rounded-full text-xs font-medium border border-primary/30">
              <Tag className="h-3 w-3" />
              {shop.discountCode}
            </div>
          </div>
        )}
        <div className="flex flex-col gap-2 mt-2 sm:mt-3">
          <div className="flex items-center justify-between gap-4 mt-3 sm:mt-2">
            <div className="flex gap-4">
              {shop.website && (
                <a
                  href={shop.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="text-white hover:text-primary transition-colors p-1"
                >
                  <ExternalLink className="h-6 w-6 sm:h-5 sm:w-5" />
                </a>
              )}
              {shop.instagramLink && (
                <a
                  href={shop.instagramLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="text-white hover:text-primary transition-colors p-1"
                >
                  <Instagram className="h-6 w-6 sm:h-5 sm:w-5" />
                </a>
              )}
              {shop.facebookLink && (
                <a
                  href={shop.facebookLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="text-white hover:text-primary transition-colors p-1"
                >
                  <Facebook className="h-6 w-6 sm:h-5 sm:w-5" />
                </a>
              )}
            </div>
            <div className="flex gap-2">
              <div
                className="text-white hover:text-primary transition-colors p-1 cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  if (navigator.share) {
                    navigator.share({
                      title: shop.name,
                      text: `Check out ${shop.name} - ${shop.location}`,
                      url: shop.website || window.location.href
                    });
                  } else {
                    // Fallback for browsers that don't support the Web Share API
                    navigator.clipboard.writeText(shop.website || window.location.href);
                    toast({
                      title: "Link copied to clipboard",
                      description: "Share this shop's website with your friends!",
                    });
                  }
                }}
              >
                <Share className="h-6 w-6 sm:h-5 sm:w-5" />
              </div>
              {shop.googleMapLink && (
                <a
                  href={shop.googleMapLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="text-white hover:text-primary transition-colors p-1"
                >
                  <MapPin className="h-6 w-6 sm:h-5 sm:w-5" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
} 