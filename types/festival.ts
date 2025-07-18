export interface Festival {
  id: string;
  name: string;
  date: string;
  time: string;
  location: string;
  state: string;
  country?: string;
  price?: string;
  description?: string;
  imageUrl?: string;
  websiteUrl?: string;
  ticketLink?: string;
  googleMapLink?: string;
  startDate?: string;
  endDate?: string;
  eventLink?: string;
  ambassadorCode?: string;
  danceStyles?: string[] | string;
  featured?: 'yes' | 'no';
  published?: boolean;
  status?: 'pending' | 'approved' | 'rejected';
  instagramLink?: string;
  facebookLink?: string;
} 