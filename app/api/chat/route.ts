import { NextResponse } from 'next/server'
import { google } from 'googleapis'

// Map of cities to their calendar IDs
const cityCalendarMap = {
  'sydney': '4ea35178b00a2daa33a492682e866bd67e8b83797a948a31caa8a37e2a982dce@group.calendar.google.com',
  'melbourne': '641b8d8fbee5ff9eb2402997e5990b3e52a737b134ec201748349884985c84f4@group.calendar.google.com',
  'brisbane': 'f0b5764410b23c93087a7d3ef5ed0d0a295ad2b811d10bb772533d7517d2fdc5@group.calendar.google.com',
  'adelaide': '6b95632fc6fe63530bbdd89c944d792009478636f5b2ce7ffc8718ccd500915f@group.calendar.google.com',
  'gold coast': 'c9ed91c3930331387d69631072510838ec9155b75ca697065025d24e34cde78b@group.calendar.google.com',
  'perth': 'e521c86aed4060431cf6de7405315790dcca0a10d4779cc333835199f3724c16@group.calendar.google.com',
  'canberra': '3a82a9f1ed5a4e865ed9f13b24a96004fe7c4b2deb07a422f068c70753f421eb@group.calendar.google.com',
  'darwin': '27319882e504521ffd07dca62fdf7a55f835bfb4233f4c096e787fa8e8fb881b@group.calendar.google.com',
  'hobart': '2f92a58bc97f58a3285a05a474f222d22aaed327af7431f21c2ad1a681c9607b@group.calendar.google.com'
}

// Map of cities to their timezones
const cityTimezones = {
  'sydney': 'Australia/Sydney',
  'melbourne': 'Australia/Melbourne',
  'brisbane': 'Australia/Brisbane',
  'adelaide': 'Australia/Adelaide',
  'gold coast': 'Australia/Brisbane',
  'perth': 'Australia/Perth',
  'canberra': 'Australia/Sydney',
  'darwin': 'Australia/Darwin',
  'hobart': 'Australia/Hobart'
}

// Function to get timezone for a city
function getTimezoneForCity(city: string | null): string {
  if (!city) return 'Australia/Sydney'; // Default to Sydney timezone
  
  const cityLower = city.toLowerCase();
  for (const [key, timezone] of Object.entries(cityTimezones)) {
    if (cityLower.includes(key)) {
      return timezone;
    }
  }
  return 'Australia/Sydney'; // Default to Sydney if no match
}

// Function to parse date and time expressions
function parseDateTimeExpression(expression: string | null, location: string | null): { timeMin: string; timeMax: string } | null {
  if (!expression) return null;

  const timezone = getTimezoneForCity(location);
  const now = new Date();
  const localTime = new Date(now.toLocaleString('en-US', { timeZone: timezone }));
  
  let timeMin: string;
  let timeMax: string;

  // Handle different time expressions
  if (expression.toLowerCase().includes('tonight')) {
    // Tonight means from now until midnight
    const startTime = new Date(localTime);
    // If it's after 5 PM, start from now, otherwise start from 5 PM
    if (startTime.getHours() < 17) {
      startTime.setHours(17, 0, 0, 0);
    }
    timeMin = startTime.toISOString();
    
    const endTime = new Date(localTime);
    endTime.setHours(23, 59, 59, 999);
    timeMax = endTime.toISOString();
  } else if (expression.toLowerCase().includes('today')) {
    // Today means from now until midnight
    const startTime = new Date(localTime);
    startTime.setHours(0, 0, 0, 0);
    timeMin = startTime.toISOString();
    
    const endTime = new Date(localTime);
    endTime.setHours(23, 59, 59, 999);
    timeMax = endTime.toISOString();
  } else if (expression.toLowerCase().includes('tomorrow')) {
    // Tomorrow means from midnight to midnight
    const startTime = new Date(localTime);
    startTime.setDate(startTime.getDate() + 1);
    startTime.setHours(0, 0, 0, 0);
    timeMin = startTime.toISOString();
    
    const endTime = new Date(startTime);
    endTime.setHours(23, 59, 59, 999);
    timeMax = endTime.toISOString();
  } else if (expression.toLowerCase().includes('weekend')) {
    // Weekend means from now until Sunday midnight
    const startTime = new Date(localTime);
    const daysUntilSunday = 7 - startTime.getDay();
    startTime.setDate(startTime.getDate() + daysUntilSunday);
    startTime.setHours(0, 0, 0, 0);
    timeMin = startTime.toISOString();
    
    const endTime = new Date(startTime);
    endTime.setHours(23, 59, 59, 999);
    timeMax = endTime.toISOString();
  } else {
    // For specific dates, use the provided date
    const dateMatch = expression.match(/(\d{1,2}(?:st|nd|rd|th)?\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{4})/i);
    if (dateMatch) {
      const searchDate = new Date(dateMatch[1]);
      searchDate.setHours(0, 0, 0, 0);
      timeMin = searchDate.toISOString();
      
      const endDate = new Date(searchDate);
      endDate.setHours(23, 59, 59, 999);
      timeMax = endDate.toISOString();
    } else {
      // Default to today if no specific date is provided
      const startTime = new Date(localTime);
      startTime.setHours(0, 0, 0, 0);
      timeMin = startTime.toISOString();
      
      const endTime = new Date(localTime);
      endTime.setHours(23, 59, 59, 999);
      timeMax = endTime.toISOString();
    }
  }

  return { timeMin, timeMax };
}

// Function to extract date and location from user message
function parseUserQuery(message: string) {
  const dateRegex = /(\d{1,2}(?:st|nd|rd|th)?\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{4})/i
  const locationRegex = /(?:in|at|near|around)\s+([A-Za-z\s,]+)/i
  const timeRegex = /(tonight|today|tomorrow|weekend|this week|next week)/i
  const dayRegex = /\b(monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/i

  const dateMatch = message.match(dateRegex)
  const locationMatch = message.match(locationRegex)
  const timeMatch = message.match(timeRegex)
  const dayMatch = message.match(dayRegex)

  return {
    date: dateMatch ? dateMatch[1] : (timeMatch ? timeMatch[1] : (dayMatch ? dayMatch[1] : 'today')),
    location: locationMatch ? locationMatch[1].trim() : null
  }
}

// Function to search for events
async function searchCalendarEvents(date: string | null, location: string | null) {
  try {
    console.log('Starting event search...', { date, location })
    
    // Parse date expression with location for timezone
    let timeRange = parseDateTimeExpression(date, location);
    if (!timeRange) {
      console.log('No valid time range found, defaulting to today');
      const now = new Date();
      const timeMin = new Date(now.setHours(0, 0, 0, 0)).toISOString();
      const timeMax = new Date(now.setHours(23, 59, 59, 999)).toISOString();
      timeRange = { timeMin, timeMax };
    }
    
    console.log('Search time range:', { 
      timeMin: new Date(timeRange.timeMin).toLocaleString(),
      timeMax: new Date(timeRange.timeMax).toLocaleString()
    })

    // Verify API key is available
    if (!process.env.GOOGLE_API_KEY) {
      throw new Error('GOOGLE_API_KEY is not set in environment variables')
    }

    let allEvents: Array<{
      id: string;
      name: string;
      eventDate: string;
      startTime: Date;
      endTime: Date;
      location: string;
      city: string;
      state: string;
      description: string;
      summary?: string;
      price?: string;
      danceStyles?: string;
      imageUrl?: string;
      eventLink?: string;
      ticketLink?: string;
      comment?: string;
      googleMapLink?: string;
      isWeekly?: boolean;
      recurrence?: string;
      isWorkshop?: boolean;
    }> = [];
    const timezone = getTimezoneForCity(location);

    // If location is specified, only search in that city's calendar
    let calendarsToSearch;
    if (location) {
      const locationLower = location.toLowerCase();
      calendarsToSearch = Object.entries(cityCalendarMap).filter(([city]) => 
        city.toLowerCase().includes(locationLower)
      );
      console.log(`Searching calendars for location: ${location}`, calendarsToSearch.map(([city]) => city));
    } else {
      calendarsToSearch = Object.entries(cityCalendarMap);
      console.log('No location specified, searching all calendars:', calendarsToSearch.map(([city]) => city));
    }

    // Search in relevant calendars
    for (const [city, calendarId] of calendarsToSearch) {
      try {
        // Construct the URL for direct API access
        const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events?` +
          `key=${process.env.GOOGLE_API_KEY}&` +
          `timeMin=${timeRange.timeMin}&` +
          `timeMax=${timeRange.timeMax}&` +
          `singleEvents=true&` +
          `orderBy=startTime&` +
          `maxResults=250`

        console.log(`Fetching events for ${city} calendar...`)

        // Fetch events directly from Google Calendar API
        const response = await fetch(url)
        
        if (!response.ok) {
          console.error(`Error fetching events for ${city}:`, await response.json())
          continue // Skip this calendar if there's an error
        }

        const data = await response.json()
        const events = data.items || []
        
        console.log(`Found ${events.length} events in ${city} calendar`)
        
        // Add city information and format times in the user's timezone
        const eventsWithCity = events.map((event: {
          start: { dateTime?: string; date?: string };
          end: { dateTime?: string; date?: string };
          summary?: string;
          location?: string;
          description?: string;
          attachments?: Array<{ fileUrl: string }>;
        }) => {
          const startTime = new Date(event.start.dateTime || event.start.date || new Date().toISOString());
          const endTime = new Date(event.end.dateTime || event.end.date || new Date().toISOString());
          
          return {
            ...event,
            city,
            startTime,
            endTime,
            formattedStart: startTime.toLocaleString('en-AU', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              timeZone: timezone
            }),
            formattedEnd: endTime.toLocaleString('en-AU', {
              hour: '2-digit',
              minute: '2-digit',
              timeZone: timezone
            })
          };
        });

        allEvents = [...allEvents, ...eventsWithCity]
      } catch (error) {
        console.error(`Error fetching events for ${city}:`, error)
        continue // Skip this calendar if there's an error
      }
    }

    console.log(`Total events found across all calendars: ${allEvents.length}`)

    // Sort all events by start time
    allEvents.sort((a, b) => a.startTime.getTime() - b.startTime.getTime());

    return allEvents;
  } catch (error) {
    console.error('Error in searchCalendarEvents:', error)
    if (error instanceof Error) {
      console.error('Error details:', {
        message: error.message,
        name: error.name,
        stack: error.stack
      })
    }
    return []
  }
}

export async function POST(req: Request) {
  try {
    const { message } = await req.json()
    const { date, location } = parseUserQuery(message)
    const searchResults = await searchCalendarEvents(date, location)
    
    if (searchResults.length > 0) {
      let responseMessage = "I found these events:";
      
      if (location) {
        responseMessage = `Here are events in ${location}:`;
      } else if (date && date !== 'today') {
        responseMessage = `Here are events for ${date}:`;
      }

      return NextResponse.json({ 
        message: responseMessage,
        events: searchResults
      })
    } else {
      let noResultsMessage = "I couldn't find any events matching your query.";
      
      if (location) {
        noResultsMessage += ` Try checking our events page for activities in ${location}.`;
      } else if (date && date !== 'today') {
        noResultsMessage += ` Try checking our events page for activities on ${date}.`;
      } else {
        noResultsMessage += " You can check our events page for more information.";
      }

      return NextResponse.json({ 
        message: noResultsMessage
      })
    }
  } catch (error) {
    console.error('Calendar error:', error)
    return NextResponse.json({ 
      message: "I'm having trouble accessing the calendar right now. Please try again later or check our events page directly."
    })
  }
} 