import { Event } from '@/types/event'; // Assuming your Event type is here

// Helper function to convert Google Drive URLs (if needed by formatEvents)
function convertGoogleDriveUrl(url: string): string {
  if (!url) return '/placeholder.svg';
  if (url.includes('uc?export=view&id=')) {
    return url;
  }
  if (url.includes('/file/d/')) {
    const fileId = url.split('/file/d/')[1]?.split('/')[0];
    return fileId ? `https://drive.google.com/uc?export=view&id=${fileId}` : '/placeholder.svg';
  }
  // Add other potential formats if necessary
  return url.startsWith('http') ? url : '/placeholder.svg'; // Basic check for valid URL start
}

// The main formatting function
export const formatEvents = (googleEvents: any[]): Event[] => {
  if (!Array.isArray(googleEvents)) {
     console.warn("formatEvents received non-array input:", googleEvents);
     return []; // Return empty array if input is not an array
  }

  return googleEvents.map((event: any) => {
    let imageUrl = '/placeholder.svg';
    let description = event.description || "No description available.";

    if (event.description) {
      const imageMatch = event.description.match(/\[image:(.*?)\]/);
      if (imageMatch && imageMatch[1]) {
        imageUrl = convertGoogleDriveUrl(imageMatch[1].trim());
        // Remove the image tag from the description
        description = event.description.replace(/\[image:.*?\]/, '').trim();
      }
    }

    const startDateTime = event.start?.dateTime;
    const endDateTime = event.end?.dateTime;
    const startDate = event.start?.date; // For all-day events

    // Basic price extraction (example, adjust as needed)
    const priceMatch = description.match(/Price:\s*\$?(\d+(\.\d{1,2})?)/i);
    const price = priceMatch ? priceMatch[1] : "Check event"; // Default if no price found

    const location = event.location || "Location TBA";
    const locationParts = location.split(',').map((part: string) => part.trim());
    const city = locationParts.length > 1 ? locationParts[locationParts.length - 2] : "TBA";
    const state = locationParts.length > 0 ? locationParts[locationParts.length - 1] : "TBA";

    const now = new Date().toISOString();

    return {
      id: event.id || event.iCalUID || `fallback-${Math.random()}`, // Ensure unique ID
      name: event.summary || "Untitled Event",
      description: description,
      startDate: startDateTime ? new Date(startDateTime).toISOString() : startDate,
      endDate: endDateTime ? new Date(endDateTime).toISOString() : startDate,
      time: startDateTime ? new Date(startDateTime).toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit', hour12: true, timeZone: 'Australia/Sydney' }) : 'All Day',
      location: location,
      city: city,
      state: state,
      imageUrl: imageUrl,
      comment: "",
      eventLink: event.htmlLink || "",
      danceStyles: ["Bachata"],
      ticketLink: "", // Extract if available
      facebookLink: "",
      instagramLink: "",
      websiteLink: "",
      createdAt: now,
      updatedAt: now
    };
  }).filter(event => event.id); // Ensure events have an ID
}; 