'use client'

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Instagram, Facebook, MapPin, Tag, Info, ExternalLink } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { Shop } from "@/types/shop"

interface ShopCardProps {
  shop: Shop
}

export function ShopCard({ shop }: ShopCardProps) {
  const [isInfoOpen, setIsInfoOpen] = useState(false)
  const [isImageOpen, setIsImageOpen] = useState(false)

  const handleImageClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (shop.website) {
      window.open(shop.website, '_blank', 'noopener,noreferrer');
    } else {
      setIsImageOpen(true);
    }
  }

  const hasInfo = shop.info && shop.info.trim().length > 0
  const hasWebsite = shop.website && shop.website.trim().length > 0
  const hasDiscount = shop.discountCode && typeof shop.discountCode === 'string' && shop.discountCode.trim().length > 0

  return (
    <>
      <Card className="overflow-hidden group flex flex-col bg-white dark:bg-gray-900 shadow-sm hover:shadow-md transition-shadow duration-200 rounded-xl">
        {/* Image Section */}
        <div
          className="relative aspect-[4/3] cursor-pointer overflow-hidden"
          onClick={handleImageClick}
        >
          <img
            src={shop.imageUrl}
            alt={shop.name}
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
          />
          {/* Hover overlay */}
          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
            {hasWebsite ? (
              <div className="bg-white/20 backdrop-blur-sm rounded-full p-2">
                <ExternalLink className="w-5 h-5 text-white" />
              </div>
            ) : (
              <div className="bg-white/20 backdrop-blur-sm rounded-full p-2">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            )}
          </div>

          {/* Price badge - top left */}
          {shop.price && (
            <div className="absolute top-2 left-2 bg-gradient-to-r from-yellow-300 to-yellow-500 text-gray-800 px-2 py-0.5 rounded-lg text-xs font-bold shadow-md">
              {shop.price}
            </div>
          )}

          {/* Discount badge - top right */}
          {hasDiscount && (
            <div className="absolute top-2 right-2 bg-gradient-to-r from-primary to-secondary text-white px-2 py-0.5 rounded-full text-xs font-bold shadow-md flex items-center gap-1">
              <Tag className="h-3 w-3" />
              {shop.discountCode!.trim()}
            </div>
          )}
        </div>

        {/* Info Section */}
        <div className="p-2.5 sm:p-3 flex flex-col gap-2">
          <div className="flex items-start justify-between gap-1">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-1 leading-snug">
              {shop.name}
            </h3>
            {shop.comment && (
              <Badge variant="secondary" className="shrink-0 text-xs px-1.5 py-0 bg-primary/10 text-primary border-primary/20">
                {shop.comment}
              </Badge>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-between gap-1">
            <div className="flex items-center gap-1">
              {hasInfo && (
                <button
                  onClick={() => setIsInfoOpen(true)}
                  className="p-1.5 bg-gray-100 hover:bg-primary/10 text-gray-500 hover:text-primary rounded-full transition-colors duration-200"
                  title="More Info"
                >
                  <Info className="h-3.5 w-3.5" />
                </button>
              )}
              {shop.instagramUrl && (
                <a
                  href={shop.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="p-1.5 bg-gray-100 hover:bg-primary/10 text-gray-500 hover:text-primary rounded-full transition-colors duration-200"
                  title="Instagram"
                >
                  <Instagram className="h-3.5 w-3.5" />
                </a>
              )}
              {shop.facebookUrl && (
                <a
                  href={shop.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="p-1.5 bg-gray-100 hover:bg-primary/10 text-gray-500 hover:text-primary rounded-full transition-colors duration-200"
                  title="Facebook"
                >
                  <Facebook className="h-3.5 w-3.5" />
                </a>
              )}
            </div>
            <div className="flex items-center gap-1">
              <button
                className="px-2.5 py-1 bg-primary/10 hover:bg-primary/20 text-primary rounded-md text-xs font-medium transition-colors duration-200"
                onClick={(e) => {
                  e.stopPropagation();
                  if (navigator.share) {
                    navigator.share({
                      title: shop.name,
                      url: shop.website || window.location.href
                    });
                  } else {
                    navigator.clipboard.writeText(shop.website || window.location.href);
                    toast({
                      title: "Link copied to clipboard",
                    });
                  }
                }}
              >
                Share
              </button>
              {shop.googleMapLink && (
                <a
                  href={shop.googleMapLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="p-1.5 bg-gray-100 hover:bg-primary/10 text-gray-500 hover:text-primary rounded-full transition-colors duration-200"
                  title="Map"
                >
                  <MapPin className="h-3.5 w-3.5" />
                </a>
              )}
            </div>
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
