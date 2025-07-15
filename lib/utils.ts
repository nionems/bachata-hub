'use client';

import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function getGoogleCalendarEvents(calendarId: string) {
  if (!calendarId) {
    console.warn('No calendar ID provided to getGoogleCalendarEvents');
    return [];
  }

  try {
    const response = await fetch(`/api/calendar/events?calendarId=${encodeURIComponent(calendarId)}`);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Calendar API error:', errorData);
      return getMockEvents();
    }

    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Error fetching Google Calendar events:", error);
    return getMockEvents();
  }
}

// Mock events for local development
function getMockEvents() {
  return [
    {
      id: "1",
      summary: "Sydney Bachata Social",
      description: "Join us for a night of Bachata dancing in Sydney!",
      location: "Sydney Dance Studio, 123 Dance St, Sydney",
      start: { dateTime: "2025-06-15T19:00:00+10:00" },
      end: { dateTime: "2025-06-15T23:00:00+10:00" },
      htmlLink: "https://calendar.google.com",
    },
    {
      id: "2",
      summary: "Melbourne Bachata Workshop",
      description: "Learn advanced Bachata techniques with our guest instructor.",
      location: "Melbourne Latin Dance, 456 Rhythm Ave, Melbourne",
      start: { dateTime: "2025-06-22T14:00:00+10:00" },
      end: { dateTime: "2025-06-22T16:00:00+10:00" },
      htmlLink: "https://calendar.google.com",
    },
    {
      id: "3",
      summary: "Brisbane Bachata Festival",
      description: "A weekend of Bachata workshops, performances, and social dancing.",
      location: "Brisbane Convention Center, Brisbane",
      start: { date: "2025-07-10" },
      end: { date: "2025-07-12" },
      htmlLink: "https://calendar.google.com",
    },
  ];
}

/**
 * Normalize dance styles from old string format to new array format
 * Handles migration from comma-separated strings to arrays
 */
export function normalizeDanceStyles(danceStyles: string | string[] | undefined): string[] {
  if (!danceStyles) return []
  
  if (Array.isArray(danceStyles)) {
    return danceStyles.filter(Boolean)
  }
  
  // Handle old string format
  if (typeof danceStyles === 'string') {
    return danceStyles
      .split(',')
      .map(style => style.trim())
      .filter(Boolean)
  }
  
  return []
}
