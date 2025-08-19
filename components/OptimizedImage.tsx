import { useState, useEffect } from 'react'
import Image from 'next/image'

interface OptimizedImageProps {
  src: string
  alt: string
  fill?: boolean
  width?: number
  height?: number
  className?: string
  priority?: boolean
  sizes?: string
  onClick?: (e: React.MouseEvent) => void
  onLoad?: () => void
}

export function OptimizedImage({
  src,
  alt,
  fill = false,
  width,
  height,
  className = "",
  priority = false,
  sizes,
  onClick,
  onLoad
}: OptimizedImageProps) {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)
  const [currentSrc, setCurrentSrc] = useState(src)

  // Handle image errors and fallback
  const handleError = () => {
    if (!imageError) {
      setImageError(true)
      // Fallback to placeholder or different image format
      setCurrentSrc('/images/placeholder.jpg')
    }
  }

  // Handle successful image load
  const handleLoad = () => {
    setImageLoaded(true)
    onLoad?.()
  }

  // Reset state when src changes
  useEffect(() => {
    setCurrentSrc(src)
    setImageLoaded(false)
    setImageError(false)
  }, [src])

  // Generate optimized src with WebP support
  const getOptimizedSrc = (originalSrc: string) => {
    // If it's already a data URL or external URL, return as is
    if (originalSrc.startsWith('data:') || originalSrc.startsWith('http')) {
      return originalSrc
    }
    
    // For local images, you could add WebP conversion logic here
    // This would require server-side image processing
    return originalSrc
  }

  const optimizedSrc = getOptimizedSrc(currentSrc)

  return (
    <div className={`relative ${className}`}>
      {/* Loading skeleton */}
      {!imageLoaded && !imageError && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-primary rounded-full animate-spin"></div>
        </div>
      )}

      {/* Error fallback */}
      {imageError && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
          <div className="text-gray-400 text-sm">Image unavailable</div>
        </div>
      )}

      {/* Optimized image */}
      <Image
        src={optimizedSrc}
        alt={alt}
        fill={fill}
        width={!fill ? width : undefined}
        height={!fill ? height : undefined}
        className={`transition-opacity duration-300 ${
          imageLoaded ? 'opacity-100' : 'opacity-0'
        } ${onClick ? 'cursor-pointer' : ''}`}
        priority={priority}
        sizes={sizes}
        loading={priority ? 'eager' : 'lazy'}
        onClick={onClick}
        onLoad={handleLoad}
        onError={handleError}
        quality={85} // Optimize quality for better performance
        placeholder="blur"
        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
      />
    </div>
  )
}
