export interface Competition {
  id: string
  name: string
  organizer: string
  contactInfo: string
  email: string
  startDate: string
  endDate: string
  location: string
  state: string
  address: string
  eventLink: string
  price: string
  ticketLink: string
  danceStyles: string
  imageUrl: string
  comment: string
  googleMapLink: string
  categories: string[]
  level: string[]
  status: 'Upcoming' | 'Completed'
  socialLink: string
  createdAt: string
  updatedAt: string
} 