'use client'

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Globe, Share, Instagram, Facebook, MapPin, Tag } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { Shop } from "@/types/shop"

interface ShopCardProps {
  shop: Shop
}

export function ShopCard({ shop }: ShopCardProps) {
  return (
    <Card className="relative overflow-hidden group cursor-pointer h-[400px]">
      <div className="aspect-w-16 aspect-h-9 relative h-[400px]">
        <img
          src={shop.imageUrl}
          alt={shop.name}
          className="object-cover w-full h-full"
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
        {shop.discountCode && (
          <div className="absolute top-4 right-4 bg-primary text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1 shadow-lg transform rotate-3 hover:rotate-0 transition-transform duration-200">
            <Tag className="h-4 w-4" />
            {shop.discountCode}
          </div>
        )}
      </div>

      <div className="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3 sm:p-4">
        <h3 className="text-base sm:text-lg font-semibold text-white line-clamp-1">{shop.name}</h3>
        <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-200 mt-1">
          <MapPin className="h-3 w-3 sm:h-4 sm:w-4" />
          <span className="line-clamp-1">{shop.location}</span>
        </div>
        {shop.comment && (
          <div className="text-xs sm:text-sm text-gray-300 mt-1 line-clamp-2">
            {shop.comment}
          </div>
        )}
        <div className="flex flex-col gap-2 mt-2 sm:mt-3">
          {shop.website && (
            <Button
              className="w-full bg-primary hover:bg-primary/90 text-white text-xs h-7 sm:h-8 flex items-center justify-center gap-2"
              onClick={(e) => {
                e.stopPropagation();
                window.open(shop.website, '_blank');
              }}
            >
              <Globe className="h-3 w-3 sm:h-4 sm:w-4" />
              <span>Website</span>
            </Button>
          )}
          <Button
            variant="outline"
            className="w-full border-primary text-primary hover:bg-primary/10 text-xs h-7 sm:h-8 flex items-center justify-center gap-2"
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
            <Share className="h-3 w-3 sm:h-4 sm:w-4" />
            <span>Share</span>
          </Button>
          <div className="flex gap-2">
            {shop.instagramLink && (
              <Button
                variant="outline"
                className="flex-1 border-primary text-primary hover:bg-primary/10 text-xs h-7 sm:h-8 flex items-center justify-center gap-2"
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(shop.instagramLink, '_blank');
                }}
              >
                <Instagram className="h-3 w-3 sm:h-4 sm:w-4" />
                <span>Instagram</span>
              </Button>
            )}
            {shop.facebookLink && (
              <Button
                variant="outline"
                className="flex-1 border-primary text-primary hover:bg-primary/10 text-xs h-7 sm:h-8 flex items-center justify-center gap-2"
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(shop.facebookLink, '_blank');
                }}
              >
                <Facebook className="h-3 w-3 sm:h-4 sm:w-4" />
                <span>Facebook</span>
              </Button>
            )}
            {shop.googleMapLink && (
              <Button
                variant="outline"
                className="flex-1 border-primary text-primary hover:bg-primary/10 text-xs h-7 sm:h-8 flex items-center justify-center gap-2"
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(shop.googleMapLink, '_blank');
                }}
              >
                <MapPin className="h-3 w-3 sm:h-4 sm:w-4" />
                <span>Map</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </Card>
  )
} 