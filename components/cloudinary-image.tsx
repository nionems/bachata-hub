import Image from 'next/image'

interface CloudinaryImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  fill?: boolean
  className?: string
  priority?: boolean
  sizes?: string
  quality?: number
  format?: 'auto' | 'webp' | 'jpg' | 'png'
  crop?: 'fill' | 'fit' | 'crop' | 'thumb' | 'scale'
  gravity?: 'auto' | 'face' | 'center' | 'north' | 'south' | 'east' | 'west'
  onError?: (e: React.SyntheticEvent<HTMLImageElement>) => void
  onLoad?: () => void
}

export function CloudinaryImage({
  src,
  alt,
  width,
  height,
  fill,
  className,
  priority,
  sizes,
  quality = 75, // Standardized quality value
  format = 'auto',
  crop = 'fill',
  gravity = 'auto',
  onError,
  onLoad,
}: CloudinaryImageProps) {
  // If it's the placeholder SVG, use regular img tag (SVGs shouldn't go through Image optimization)
  if (src === '/images/placeholder.svg' || src === '/placeholder.svg') {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
        <img
          src="/images/placeholder.svg"
          alt="No image available"
          className="object-contain p-8 w-full h-full"
        />
      </div>
    )
  }

  // Clean the URL of any HTML, extra characters, and URL-encoded characters
  const cleanUrl = src
    ?.replace(/["']/g, '') // Remove quotes
    .replace(/%3E/g, '') // Remove URL-encoded '>'
    .replace(/>/g, '') // Remove '>' directly
    .trim()
    .split(' ')[0] // Take only the first part if there are multiple URLs
    .split('%3E')[0] // Take only the first part if URLs are joined with %3E
    .split('>')[0] // Take only the first part if URLs are joined with >

  // If the URL is malformed or empty, use placeholder SVG (use regular img tag)
  if (!cleanUrl || cleanUrl.length === 0) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
        <img
          src="/images/placeholder.svg"
          alt="No image available"
          className="object-contain p-8 w-full h-full"
        />
      </div>
    )
  }

  // Check if the URL is a Cloudinary URL
  const isCloudinaryUrl = cleanUrl?.includes('res.cloudinary.com')
  
  // If it's a Cloudinary URL, use unoptimized since Cloudinary already optimizes
  // Cloudinary handles optimization, so we don't need Next.js to optimize again
  if (isCloudinaryUrl) {
    const optimizedUrl = cleanUrl.replace('/upload/', `/upload/f_${format},q_${quality},c_${crop},g_${gravity}/`)
    return (
      <Image
        src={optimizedUrl}
        alt={alt}
        width={width}
        height={height}
        fill={fill}
        className={className}
        priority={priority}
        sizes={sizes || (fill ? '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw' : undefined)}
        unoptimized={true} // Cloudinary already optimizes, skip Next.js optimization
        onError={(e) => {
          console.error('Error loading Cloudinary image:', optimizedUrl)
          if (onError) onError(e)
        }}
        onLoad={onLoad}
      />
    )
  }

  // For any other URL (Google Drive or direct image), use it directly with Next.js optimization
  return (
    <Image
      src={cleanUrl}
      alt={alt}
      width={width}
      height={height}
      fill={fill}
      className={className}
      priority={priority}
      sizes={sizes || (fill ? '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw' : undefined)}
      quality={75} // Standardized quality value
      onError={(e) => {
        console.error('Error loading image:', cleanUrl)
        if (onError) onError(e)
      }}
      onLoad={onLoad}
    />
  )
} 