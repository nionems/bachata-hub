export interface Instructor {
  id: string;
  name: string;
  location: string;
  state: string;
  imageUrl: string;
  comment?: string;
  danceStyles: string[];
  emailLink?: string;
  facebookLink?: string;
  instagramLink?: string;
  privatePricePerHour?: string;
  createdAt: string;
  updatedAt: string;
} 