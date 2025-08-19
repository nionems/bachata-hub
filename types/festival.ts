export interface Festival {
  id: string;
  name: string;
  date: string;
  time: string;
  location: string;
  state: string;
  country?: string;
  imageUrl?: string;
  websiteUrl?: string;
  ticketLink?: string;
  googleMapLink?: string;
  startDate?: string;
  endDate?: string;
  eventLink?: string;
  description?: string;
  price?: string;
  ambassadorCode?: string;
  danceStyles?: string[] | string;
  featured?: 'yes' | 'no';
  published?: boolean;
  status?: 'pending' | 'approved' | 'rejected';
  instagramLink?: string;
  facebookLink?: string;
} 