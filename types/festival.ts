export interface Festival {
  id: string;
  name: string;
  date: string;
  time: string;
  location: string;
  state: string;
  price?: string;
  description?: string;
  imageUrl?: string;
  websiteUrl?: string;
  ticketLink?: string;
  googleMapLink?: string;
  startDate?: string;
  endDate?: string;
  eventLink?: string;
  comment?: string;
  featured?: 'yes' | 'no';
  published?: boolean;
} 