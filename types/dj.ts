export interface Dj {
  id: string;
  name: string;
  location: string;
  state: string;
  email: string; // Primary email address (admin use only)
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