'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Calendar, Users, Info, CheckCircle } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

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
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-4">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Bachata Events Calendar</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            View all upcoming Bachata events across Australia. Click on any event for more details.
          </p>
        </div>

        {/* Calendar Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center">
            <div className="flex items-center mb-3 sm:mb-0 sm:mr-4">
              <Info className="h-4 w-4 text-blue-600 mr-2 flex-shrink-0" />
              <span className="text-sm text-gray-700">
                Events with{" "}
                <span className="inline-flex items-center text-green-600 font-medium">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  green highlighting
                </span>{" "}
                are in your Google Calendar
              </span>
            </div>
          </div>
        </div>

        {/* Calendar Embed */}
        <Card>
          <CardHeader className="p-6">
            <CardTitle className="text-xl">Bachata Australia Events Calendar</CardTitle>
            <CardDescription>
              View all upcoming Bachata events in Australia. Click on an event for more details.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="border-t border-gray-200">
              <div className="bg-gradient-to-r from-green-600 to-yellow-500 p-3 sm:p-4 flex justify-between items-center">
                <h3 className="text-white font-bold text-sm sm:text-lg">Bachata Events Calendar</h3>
                <div className="flex space-x-1 sm:space-x-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    className="bg-white text-green-700 hover:bg-gray-100 text-xs sm:text-sm h-7 sm:h-9"
                  >
                    Today
                  </Button>
                  <div className="bg-white/20 rounded-md flex items-center">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-white hover:bg-white/20 h-7 sm:h-9 px-1 sm:px-3"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-chevron-left"
                      >
                        <path d="m15 18-6-6 6-6" />
                      </svg>
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-white hover:bg-white/20 h-7 sm:h-9 px-1 sm:px-3"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-chevron-right"
                      >
                        <path d="m9 18 6-6-6-6" />
                      </svg>
                    </Button>
                  </div>
                  <select
                    value={selectedCalendar}
                    onChange={(e) => setSelectedCalendar(e.target.value)}
                    className="bg-white text-green-700 hover:bg-gray-100 text-xs sm:text-sm h-7 sm:h-9 rounded-md border-0 focus:ring-0"
                  >
                    <option value={calendarIds.bachataSocial}>Sydney Bachata</option>
                    <option value={calendarIds.melbourneBachata}>Melbourne Bachata</option>
                    <option value={calendarIds.adelaideBachata}>Adelaide Bachata</option>
                    <option value={calendarIds.brisbaneBachata}>Brisbane Bachata</option>
                    <option value={calendarIds.perthBachata}>Perth Bachata</option>
                  </select>
                </div>
              </div>
              <iframe
                src={`https://calendar.google.com/calendar/embed?src=${encodeURIComponent(
                  selectedCalendar,
                )}&ctz=Australia%2FSydney&wkst=1&bgcolor=%23ffffff&showTitle=0&showNav=1&showDate=1&showPrint=0&showTabs=1&showCalendars=1&showTz=1&color=%23006B3F`}
                style={{ borderWidth: 0 }}
                width="100%"
                height="600"
                frameBorder="0"
                scrolling="no"
                title="Bachata Australia Events Calendar"
              ></iframe>
            </div>
          </CardContent>
        </Card>

        {/* Info Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          <div className="bg-green-50 rounded-lg p-4 border border-green-200 flex items-start">
            <Calendar className="h-5 w-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-green-800 mb-1">Add to Your Calendar</h3>
              <p className="text-sm text-green-700">
                Click the "+ Google Calendar" button at the bottom right to add this calendar to your own Google Calendar.
              </p>
            </div>
          </div>

          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200 flex items-start">
            <Users className="h-5 w-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-blue-800 mb-1">Community Events</h3>
              <p className="text-sm text-blue-700">
                This calendar includes events from dance schools, promoters, and the Bachata community across Australia.
              </p>
            </div>
          </div>

          <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200 flex items-start">
            <Info className="h-5 w-5 text-yellow-600 mr-3 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-yellow-800 mb-1">About Calendar Dates</h3>
              <p className="text-sm text-yellow-700">
                Dates with events are highlighted in the Google Calendar. Look for dates with colored indicators or event titles.
              </p>
            </div>
          </div>
        </div>

        {/* Add Event Button */}
        <div className="mt-8 text-center">
          <Link href="/calendar/add-events">
            <Button className="bg-green-600 hover:bg-green-700 text-white">
              <Calendar className="h-4 w-4 mr-2" />
              Submit Your Event
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
} 