export interface Dj {
  id: string;
  name: string;
  location: string;
  state: string;
  email: string; // Primary email address
  contact: string; // Contact field for admin dashboard compatibility
  emailLink: string; // Additional business email
  facebookLink: string;
  instagramLink: string;
  imageUrl: string;
  comment: string;
  danceStyles: string[];
  createdAt: string;
  updatedAt: string;
  musicLink: string;
  status?: 'pending' | 'approved' | 'rejected';
} 