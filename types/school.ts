export interface School {
  id: string
  name: string
  location: string
  state: string
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
  instagramUrl?: string  // Updated to match form and API field names
  facebookUrl?: string   // Updated to match form and API field names
  googleMapLink?: string  // Add Google Maps link field
  status?: 'pending' | 'approved' | 'rejected'  // Add status field for approval workflow
} 