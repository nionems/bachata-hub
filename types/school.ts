export interface School {
  id: string
  name: string
  location: string
  state: string
  address: string
  contactInfo: string
  instructors: string
  website: string
  danceStyles: string
  imageUrl: string
  imageRef: string  // Storage reference path for the image
  comment: string
  googleReviewsUrl?: string
  googleRating?: number
  googleReviewsCount?: number
  createdAt: string
  updatedAt: string
  imageFile?: File
} 