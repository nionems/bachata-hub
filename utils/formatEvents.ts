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

    return {
      id: event.id || event.iCalUID || `fallback-${Math.random()}`, // Ensure unique ID
      name: event.summary || "Untitled Event",
      date: startDateTime ? new Date(startDateTime).toISOString() : startDate, // Store ISO string or date string
      startTime: startDateTime ? new Date(startDateTime).toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit', hour12: true, timeZone: 'Australia/Sydney' }) : 'All Day',
      endTime: endDateTime ? new Date(endDateTime).toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit', hour12: true, timeZone: 'Australia/Sydney' }) : '',
      location: event.location || "Location TBA",
      state: event.location?.split(',').pop()?.trim() || "TBA", // Basic state extraction
      price: price,
      danceStyles: "Bachata", // Default or extract if available
      imageUrl: imageUrl,
      description: description, // Cleaned description
      // Add other fields your Event interface requires
      eventLink: event.htmlLink || "",
      googleMapLink: event.location ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location)}` : "",
      ticketLink: "", // Extract if available
      comment: "", // Extract if available
    };
  }).filter(event => event.id); // Ensure events have an ID
}; 