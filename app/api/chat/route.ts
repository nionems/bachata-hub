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

// Initialize Google Calendar API
const calendar = google.calendar({ version: 'v3' })

// Bachata knowledge base
const BACHATA_KNOWLEDGE = {
  "what is bachata": "Bachata is a genre of Latin American music that originated in the Dominican Republic in the early 20th century. It's characterized by its romantic lyrics and distinctive guitar sound. The dance form of bachata is a social dance that's danced in pairs, featuring a basic step pattern and sensual hip movements.",
  
  "how to dance bachata": "Bachata is danced in a 4-beat pattern. The basic step involves:\n1. Step to the side with your left foot\n2. Bring your right foot to meet your left\n3. Step to the side with your left foot\n4. Tap your right foot\n\nThe dance includes hip movements and can be danced in open or closed position. It's recommended to take classes from a qualified instructor to learn proper technique.",
  
  "bachata styles": "There are several styles of bachata:\n1. Traditional/Dominican - Closer to the original style with more footwork\n2. Modern - Incorporates elements from other dance styles\n3. Sensual - Focuses on body movement and connection\n4. Urban - Mixes bachata with urban dance elements",
  
  "bachata music": "Bachata music typically features:\n- Lead guitar (requinto)\n- Rhythm guitar\n- Bass guitar\n- Bongos\n- Güira (metal scraper)\n\nModern bachata often incorporates elements from pop, R&B, and other genres.",
  
  "bachata history": "Bachata originated in the Dominican Republic in the early 20th century. It was initially considered music of the lower class and was often associated with bars and brothels. In the 1990s, bachata gained international popularity and became more mainstream. Today, it's one of the most popular Latin dance styles worldwide.",
  
  "bachata vs salsa": "Key differences between bachata and salsa:\n- Bachata is danced in 4/4 time, while salsa is in 4/4 with a different rhythm pattern\n- Bachata is generally slower and more sensual\n- Bachata has simpler basic steps compared to salsa\n- Bachata music typically has a more romantic feel",
  
  "bachata basic steps": "The basic bachata step pattern is:\n1. Step to the side with your left foot\n2. Bring your right foot to meet your left\n3. Step to the side with your left foot\n4. Tap your right foot\n\nThis pattern is repeated in the opposite direction, starting with the right foot.",
  
  "bachata music artists": "Popular bachata artists include:\n- Romeo Santos\n- Aventura\n- Prince Royce\n- Juan Luis Guerra\n- Monchy & Alexandra\n- Xtreme\n- Toby Love",
  
  "bachata competitions": "Bachata competitions typically feature categories like:\n- Professional couples\n- Amateur couples\n- Teams\n- Solo\n\nCompetitions often have different divisions for various bachata styles (Traditional, Modern, Sensual).",
  
  "bachata festivals": "Bachata festivals are events that typically include:\n- Workshops with international instructors\n- Social dancing\n- Performances\n- Competitions\n- Parties\n\nThey're great opportunities to learn, dance, and connect with the bachata community."
}

// Function to check if credentials are valid
async function checkCredentials() {
  try {
    if (!process.env.GOOGLE_API_KEY) {
      throw new Error('GOOGLE_API_KEY is not set in environment variables')
    }
    return true
  } catch (error) {
    console.error('Calendar API credentials check failed:', error)
    return false
  }
}

// Function to handle time and date questions
function handleTimeDateQuestion(message: string) {
  const now = new Date()
  const timeRegex = /(what|tell me|show me|current|now).*(time|hour)/i
  const dateRegex = /(what|tell me|show me|current|today).*(date|day|today)/i
  
  if (timeRegex.test(message)) {
    return {
      type: 'time',
      response: `The current time is ${now.toLocaleTimeString('en-AU', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true,
        timeZone: 'Australia/Sydney'
      })}`
    }
  }
  
  if (dateRegex.test(message)) {
    return {
      type: 'date',
      response: `Today is ${now.toLocaleDateString('en-AU', { 
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timeZone: 'Australia/Sydney'
      })}`
    }
  }
  
  return null
}

// Function to handle weather questions
async function handleWeatherQuestion(message: string) {
  const weatherRegex = /(weather|temperature|forecast).*(in|at|for)\s+([A-Za-z\s,]+)/i
  const match = message.match(weatherRegex)
  
  if (match && process.env.OPENWEATHER_API_KEY) {
    const location = match[3].trim()
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(location)},AU&units=metric&appid=${process.env.OPENWEATHER_API_KEY}`
      )
      const data = await response.json()
      
      if (data.main) {
        return {
          type: 'weather',
          response: `The current temperature in ${location} is ${Math.round(data.main.temp)}°C with ${data.weather[0].description}.`
        }
      }
    } catch (error) {
      console.error('Weather API error:', error)
    }
  }
  
  return null
}

// Function to handle transport questions
async function handleTransportQuestion(message: string) {
  const transportRegex = /(how|what|tell me).*(to get|to reach|transport|bus|train|tram|ferry).*(to|from|in)\s+([A-Za-z\s,]+)/i
  const match = message.match(transportRegex)
  
  if (match && process.env.TRANSPORT_API_KEY) {
    const location = match[4].trim()
    // Here you would integrate with your preferred transport API
    // For now, return a generic response
    return {
      type: 'transport',
      response: `For transport information to ${location}, you can check Transport NSW (https://transportnsw.info) for public transport options, or use Google Maps for driving directions.`
    }
  }
  
  return null
}

// Function to extract date and location from user message
function parseUserQuery(message: string) {
  const dateRegex = /(\d{1,2}(?:st|nd|rd|th)?\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{4})/i
  const locationRegex = /(?:in|at|near)\s+([A-Za-z\s,]+)/i
  const timeRegex = /(tonight|today|tomorrow|weekend)/i
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

  // Handle day of week
  const dayOfWeek = expression.toLowerCase();
  if (['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].includes(dayOfWeek)) {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const targetDay = days.indexOf(dayOfWeek);
    const currentDay = localTime.getDay();
    
    // Calculate days until target day
    let daysUntilTarget = targetDay - currentDay;
    if (daysUntilTarget <= 0) {
      daysUntilTarget += 7; // Move to next week if the day has passed
    }
    
    const startTime = new Date(localTime);
    startTime.setDate(startTime.getDate() + daysUntilTarget);
    startTime.setHours(0, 0, 0, 0);
    timeMin = startTime.toISOString();
    
    const endTime = new Date(startTime);
    endTime.setHours(23, 59, 59, 999);
    timeMax = endTime.toISOString();
    
    return { timeMin, timeMax };
  }

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
      return null;
    }
  }

  return { timeMin, timeMax };
}

// Function to search for events
async function searchCalendarEvents(date: string | null, location: string | null) {
  try {
    console.log('Starting event search...')
    
    // Parse date expression with location for timezone
    const timeRange = parseDateTimeExpression(date, location);
    const timeMin = timeRange?.timeMin || new Date().toISOString();
    const timeMax = timeRange?.timeMax || new Date(new Date().setDate(new Date().getDate() + 1)).toISOString();
    
    console.log('Search time range:', { timeMin, timeMax })

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
    const calendarsToSearch = location 
      ? Object.entries(cityCalendarMap).filter(([city]) => 
          city.toLowerCase().includes(location.toLowerCase()))
      : Object.entries(cityCalendarMap);

    // Search in relevant calendars
    for (const [city, calendarId] of calendarsToSearch) {
      try {
        // Construct the URL for direct API access
        const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events?` +
          `key=${process.env.GOOGLE_API_KEY}&` +
          `timeMin=${timeMin}&` +
          `timeMax=${timeMax}&` +
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

    // Filter by location if provided
    if (location) {
      const locationLower = location.toLowerCase();
      allEvents = allEvents.filter(event => 
        event.location?.toLowerCase().includes(locationLower) ||
        event.summary?.toLowerCase().includes(locationLower) ||
        event.description?.toLowerCase().includes(locationLower) ||
        event.city.toLowerCase().includes(locationLower)
      );
      console.log(`Events after location filter (${location}):`, allEvents.length);
    }

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
    const lowerMessage = message.toLowerCase()

    // Check if it's a general bachata question
    for (const [key, value] of Object.entries(BACHATA_KNOWLEDGE)) {
      if (lowerMessage.includes(key)) {
        return NextResponse.json({ message: value })
      }
    }

    // Check if it's an event-related question
    if (lowerMessage.includes('event') || lowerMessage.includes('when') || lowerMessage.includes('where') || lowerMessage.includes('schedule')) {
      try {
        const { date, location } = parseUserQuery(message)
        const searchResults = await searchCalendarEvents(date, location)
        
        if (searchResults.length > 0) {
          return NextResponse.json({ 
            message: "I found these events that might interest you:",
            events: searchResults
          })
        } else {
          return NextResponse.json({ 
            message: "I couldn't find any events matching your query. You can check our events page for more information."
          })
        }
      } catch (error) {
        console.error('Calendar error:', error)
        return NextResponse.json({ 
          message: "I'm having trouble accessing the calendar right now. Please try again later or check our events page directly."
        })
      }
    }

    // Default response for unrecognized questions
    return NextResponse.json({ 
      message: "I can help you with information about bachata dance, music, and events. Try asking about bachata basics, styles, or upcoming events!"
    })

  } catch (error) {
    console.error('Chat error:', error)
    return NextResponse.json(
      { error: 'Failed to process your request' },
      { status: 500 }
    )
  }
} 