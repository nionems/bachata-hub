export interface Event {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  time: string;
  location: string;
  city: string;
  state: string;
  imageUrl: string;
  comment?: string;
  eventLink?: string;
  ticketLink?: string;
  facebookLink?: string;
  instagramLink?: string;
  websiteLink?: string;
  createdAt: string;
  updatedAt: string;
} 