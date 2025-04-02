'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Calendar, Users, Info, CheckCircle } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import CalendarEmbeds from '../components/CalendarEmbeds'

export default function CalendarPage() {
  // Your calendar IDs
  const calendarIds = {
    bachataSocial: "8d27a79f37a74ab7aedc5c038cc4492cd36b87a71b57fb6d7d141d04e8ffe5c2@group.calendar.google.com",
    melbourneBachata: "ZDg5ODU5MzdkZTBhYmU5YjYwZDg4Zjg2NWJhMjA4YzAwNzc0ZDJlMTNjNDFjOWQ4NmMwMDgzODNkNGRhMzJhOUBncm91cC5jYWxlbmRhci5nb29nbGUuY29t",
    adelaideBachata: "MTZiOGZlOTYwMDc5NGQ1OTAzMDkwMWE2NzlhODRhNmE3YTgxNmY0YjI5MjM3NzNiYWFmODg2ODcxYjE0YTJkZUBncm91cC5jYWxlbmRhci5nb29nbGUuY29t",
    brisbaneBachata: "YWFhMjIyZjZlZjBhNDNiZTUwOGUyYjVhN2EyYmNhYjIzMmZmMTlmYTlkY2UwZDE2YWViNTQ3MzczZDhkNTI0NUBncm91cC5jYWxlbmRhci5nb29nbGUuY29t",
    perthBachata: "NDY5ZmIzYmVkMDMwOGIxYThjY2M4ZTlkOTFmYjAyMDBlNmYzYWRlYWZkODE0YzE3NDdiYzk0MDkxZGMxMWFhNUBncm91cC5jYWxlbmRhci5nb29nbGUuY29t"
  }

  const [selectedCalendar, setSelectedCalendar] = useState(calendarIds.bachataSocial);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Bachata Calendars</h1>
      <div className="prose max-w-none">
        <p className="mb-8">
          View all bachata events, classes, workshops, socials, and more across different calendars.
          Each calendar is dedicated to a specific type of event to help you find exactly what you're looking for.
        </p>
        <CalendarEmbeds />
      </div>
    </div>
  );
} 