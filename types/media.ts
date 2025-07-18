export interface Media {
  id: string
  name: string
  location: string
  state: string
  imageUrl: string
  comment?: string
  instagramLink?: string
  facebookLink?: string
  emailLink?: string
  mediaLink?: string
  mediaLink2?: string
  status?: 'pending' | 'approved' | 'rejected'
  createdAt: Date
  updatedAt: Date
} 
 
 
 
 