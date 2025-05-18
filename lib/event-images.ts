export const eventImageMap: Record<string, string> = {
  'Team Latin Central': 'https://res.cloudinary.com/bachata-hub/image/upload/v1/events/team-latin-central.jpg',
  'Sydney Bachata Festival': 'https://res.cloudinary.com/bachata-hub/image/upload/v1/events/sydney-bachata-festival.jpg',
  'World Bachata Melbourne': 'https://res.cloudinary.com/bachata-hub/image/upload/v1/events/world-bachata-melbourne.jpg',
  'Brisbane Bachata Festival': 'https://res.cloudinary.com/bachata-hub/image/upload/v1/events/brisbane-bachata-festival.jpg',
  'Adelaide Bachata Festival': 'https://res.cloudinary.com/bachata-hub/image/upload/v1/events/adelaide-bachata-festival.jpg',
  'Perth Bachata Festival': 'https://res.cloudinary.com/bachata-hub/image/upload/v1/events/perth-bachata-festival.jpg',
  'Canberra Bachata Festival': 'https://res.cloudinary.com/bachata-hub/image/upload/v1/events/canberra-bachata-festival.jpg',
  'Gold Coast Bachata Festival': 'https://res.cloudinary.com/bachata-hub/image/upload/v1/events/gold-coast-bachata-festival.jpg',
  'Sydney Bachata Social': 'https://res.cloudinary.com/bachata-hub/image/upload/v1/events/sydney-bachata-social.jpg',
  'Melbourne Bachata Social': 'https://res.cloudinary.com/bachata-hub/image/upload/v1/events/melbourne-bachata-social.jpg',
  'Brisbane Bachata Social': 'https://res.cloudinary.com/bachata-hub/image/upload/v1/events/brisbane-bachata-social.jpg',
  'Adelaide Bachata Social': 'https://res.cloudinary.com/bachata-hub/image/upload/v1/events/adelaide-bachata-social.jpg',
  'Perth Bachata Social': 'https://res.cloudinary.com/bachata-hub/image/upload/v1/events/perth-bachata-social.jpg',
  'Canberra Bachata Social': 'https://res.cloudinary.com/bachata-hub/image/upload/v1/events/canberra-bachata-social.jpg',
  'Gold Coast Bachata Social': 'https://res.cloudinary.com/bachata-hub/image/upload/v1/events/gold-coast-bachata-social.jpg',
  'Sydney Bachata Workshop': 'https://res.cloudinary.com/bachata-hub/image/upload/v1/events/sydney-bachata-workshop.jpg',
  'Melbourne Bachata Workshop': 'https://res.cloudinary.com/bachata-hub/image/upload/v1/events/melbourne-bachata-workshop.jpg',
  'Brisbane Bachata Workshop': 'https://res.cloudinary.com/bachata-hub/image/upload/v1/events/brisbane-bachata-workshop.jpg',
  'Adelaide Bachata Workshop': 'https://res.cloudinary.com/bachata-hub/image/upload/v1/events/adelaide-bachata-workshop.jpg',
  'Perth Bachata Workshop': 'https://res.cloudinary.com/bachata-hub/image/upload/v1/events/perth-bachata-workshop.jpg',
  'Canberra Bachata Workshop': 'https://res.cloudinary.com/bachata-hub/image/upload/v1/events/canberra-bachata-workshop.jpg',
  'Gold Coast Bachata Workshop': 'https://res.cloudinary.com/bachata-hub/image/upload/v1/events/gold-coast-bachata-workshop.jpg',
}

export function getEventImage(eventName: string): string {
  // Try to find an exact match first
  const exactMatch = eventImageMap[eventName]
  if (exactMatch) return exactMatch

  // Try to find a partial match
  const partialMatch = Object.entries(eventImageMap).find(([key]) => 
    eventName.toLowerCase().includes(key.toLowerCase())
  )
  if (partialMatch) return partialMatch[1]

  // Return default image if no match found
  return '/images/placeholder.svg'
}

export const eventImages: { [key: string]: string } = {
  // Add event image mappings here
} 