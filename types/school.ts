export interface School {
  id: string
  name: string
  location: string
  state: string
  address: string
  contactInfo: string
  instructors: string[]
  website: string
  danceStyles: string[]
  imageUrl: string  // Keep this as the main image URL field
  imageRef: string  // Storage reference path for the image
  comment: string
  googleReviewsUrl?: string
  googleRating?: number
  googleReviewsCount?: number
  createdAt: string
  updatedAt: string
  imageFile?: File
  googleReviewLink?: string
  instagramLink?: string  // Add Instagram link field
  facebookLink?: string   // Add Facebook link field
  googleMapLink?: string  // Add Google Maps link field
} 