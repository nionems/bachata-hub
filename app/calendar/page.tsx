'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Calendar, Users, Info } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { ContactForm } from "@/components/ContactForm";

export default function CalendarPage() {
  const calendarOptions = [
    { value: "4ea35178b00a2daa33a492682e866bd67e8b83797a948a31caa8a37e2a982dce@group.calendar.google.com", label: "Sydney Bachata" },
    { value: "641b8d8fbee5ff9eb2402997e5990b3e52a737b134ec201748349884985c84f4@group.calendar.google.com", label: "Melbourne Bachata" },
    { value: "f0b5764410b23c93087a7d3ef5ed0d0a295ad2b811d10bb772533d7517d2fdc5@group.calendar.google.com", label: "Brisbane Bachata" },
    { value: "6b95632fc6fe63530bbdd89c944d792009478636f5b2ce7ffc8718ccd500915f@group.calendar.google.com", label: "Adelaide Bachata" },
    { value: "c9ed91c3930331387d69631072510838ec9155b75ca697065025d24e34cde78b@group.calendar.google.com", label: "Gold Coast Bachata" },
    { value: "e521c86aed4060431cf6de7405315790dcca0a10d4779cc333835199f3724c16@group.calendar.google.com", label: "Perth Bachata" },
    { value: "3a82a9f1ed5a4e865ed9f13b24a96004fe7c4b2deb07a422f068c70753f421eb@group.calendar.google.com", label: "Canberra Bachata" }
  ];

  const [selectedCalendar, setSelectedCalendar] = useState(calendarOptions[0].value);
  const [isContactFormOpen, setIsContactFormOpen] = useState(false);
  const [isSubmissionFormOpen, setIsSubmissionFormOpen] = useState(false);

  const selectedCalendarLabel = calendarOptions.find(option => option.value === selectedCalendar)?.label || "Bachata Hub Calendar";

  return (
    <div className="container mx-auto py-4 sm:py-6 px-3 sm:px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2 sm:mb-4">Bachata Calendar</h1>
          <p className="text-base sm:text-xl text-gray-600">
            Find all Bachata events in one place
          </p>
        </div>

        <Card className="border-0 shadow-none">
          <CardHeader className="p-3 sm:p-4 pb-0">
            <CardTitle className="text-base sm:text-lg md:text-xl text-green-700">Bachata Australia Events Calendar</CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              View all upcoming Bachata events in Australia. Click on an event for more details.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-3 sm:p-4">
            <div className="rounded-lg overflow-hidden border border-gray-200 shadow-lg">
              <div className="bg-gradient-to-r from-green-600 to-yellow-500 p-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-3">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                  <h3 className="text-white font-bold text-sm sm:text-base md:text-lg">{selectedCalendarLabel}</h3>
                </div>
                <div className="flex flex-wrap gap-2 items-center">
                  <Button
                    size="sm"
                    variant="secondary"
                    className="bg-white text-green-700 hover:bg-gray-100 text-xs sm:text-sm h-7 sm:h-8"
                  >
                    Today
                  </Button>
                  <div className="bg-white/20 rounded-md flex items-center">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-white hover:bg-white/20 h-7 sm:h-8 px-1 sm:px-2"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="12"
                        height="12"
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
                      className="text-white hover:bg-white/20 h-7 sm:h-8 px-1 sm:px-2"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="12"
                        height="12"
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
                    className="bg-white text-green-700 hover:bg-gray-100 text-xs sm:text-sm h-7 sm:h-8 rounded-md border-0 focus:ring-0"
                  >
                    {calendarOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <iframe
                src={`https://calendar.google.com/calendar/embed?src=${encodeURIComponent(
                  selectedCalendar,
                )}&ctz=Australia%2FSydney&wkst=1&bgcolor=%23ffffff&showTitle=0&showNav=1&showDate=1&showPrint=0&showTabs=1&showCalendars=1&showTz=1&color=%23${encodeURIComponent(process.env.NEXT_PUBLIC_PRIMARY_COLOR?.replace('#', '') || '006B3F')}`}
                style={{ borderWidth: 0 }}
                width="100%"
                height="400"
                frameBorder="0"
                scrolling="no"
                title="Bachata Australia Events Calendar"
                className="border-t border-gray-200"
              ></iframe>
            </div>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-green-50 rounded-lg p-3 border border-green-200 flex items-start">
                <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-green-800 mb-1 text-sm sm:text-base">Add to Your Calendar</h3>
                  <p className="text-xs sm:text-sm text-green-700">
                    Click the "+ Google Calendar" button at the bottom right to add this calendar to your own Google Calendar.
                  </p>
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-3 border border-blue-200 flex items-start">
                <Users className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-blue-800 mb-1 text-sm sm:text-base">Community Events</h3>
                  <p className="text-xs sm:text-sm text-blue-700">
                    This calendar includes events from dance schools, promoters, and the Bachata community across Australia.
                  </p>
                </div>
              </div>

              <div className="bg-yellow-50 rounded-lg p-3 border border-yellow-200 flex items-start">
                <Info className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-600 mr-2 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-yellow-800 mb-1 text-sm sm:text-base">Submit Your Event</h3>
                  <p className="text-xs sm:text-sm text-yellow-700">
                    Have a Bachata event to share? Submit it to be included in our community calendar.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 mt-6 sm:mt-8">
          <div className="lg:w-1/4">
            <Card>
              <CardHeader className="p-3 sm:p-4">
                <CardTitle className="text-base sm:text-lg md:text-xl">Calendar Features</CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  Everything you need to know about our calendar
                </CardDescription>
              </CardHeader>
              <CardContent className="p-3 sm:p-4 pt-0">
                <div className="prose max-w-none text-xs sm:text-sm">
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <Calendar className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span>View events by type</span>
                    </li>
                    <li className="flex items-start">
                      <Users className="h-4 w-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Community-driven events</span>
                    </li>
                    <li className="flex items-start">
                      <Info className="h-4 w-4 text-yellow-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Detailed event information</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200 mt-4">
              <div className="flex items-start">
                <Info className="h-4 w-4 text-yellow-600 mr-2 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-yellow-800 mb-1 text-sm">About Calendar Dates</h3>
                  <p className="text-xs text-yellow-700">
                    Dates with events are highlighted in the Google Calendar. Look for dates with colored indicators or event titles.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:w-3/4">
            <Card>
              <CardHeader className="p-3 sm:p-4">
                <CardTitle className="text-base sm:text-lg md:text-xl">About Our Events Calendar</CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  Your comprehensive resource for Bachata events across Australia
                </CardDescription>
              </CardHeader>
              <CardContent className="p-3 sm:p-4 pt-0">
                <div className="prose max-w-none text-xs sm:text-sm">
                  <p>
                    Our Bachata Australia events calendar is the central hub for all Bachata events happening across the country. From regular social dances to major festivals, workshops, and competitions, you'll find everything here.
                  </p>

                  <h3 className="text-sm sm:text-base font-medium mt-3 mb-2">
                    How to Use the Calendar
                  </h3>
                  <ul className="list-disc pl-4 space-y-1">
                    <li>Click on any event in the calendar to see full details</li>
                    <li>Use the navigation controls to move between months or weeks</li>
                    <li>Click the "+ Google Calendar" button to add our calendar to your own Google Calendar</li>
                    <li>Select different event types from the dropdown menu to view specific calendars</li>
                  </ul>

                  <h3 className="text-sm sm:text-base font-medium mt-3 mb-2">Submit Your Event</h3>
                  <p>
                    Are you organizing a Bachata event in Australia? We'd love to feature it on our calendar! Click the "Submit Your Event" button to fill out our event submission form.
                  </p>

                  <h3 className="text-sm sm:text-base font-medium mt-3 mb-2">Stay Connected</h3>
                  <p>
                    Subscribe to our calendar to stay up-to-date with all the latest Bachata events. Never miss a dance opportunity again!
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Submit Your Event Card */}
        <div className="mt-6 sm:mt-8 bg-gradient-to-r from-primary to-secondary rounded-xl shadow-xl overflow-hidden">
          <div className="p-4 sm:p-6 md:p-8 flex flex-col md:flex-row items-center justify-between">
            <div className="text-white mb-4 md:mb-0 md:mr-6">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 sm:mb-3">
                Add Your Event to Our Calendars
              </h2>
              <p className="text-white/90 text-sm sm:text-base md:text-lg mb-3 sm:mb-4">
                Have a Bachata event you'd like to add to our calendars? Get it featured and reach dancers across Australia!
              </p>
              <ul className="space-y-2">
                <li className="flex items-center text-xs sm:text-sm">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                  </svg>
                  Reach a wider audience of dance enthusiasts
                </li>
                <li className="flex items-center text-xs sm:text-sm">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                  </svg>
                  Promote your event to the dance community
                </li>
                <li className="flex items-center text-xs sm:text-sm">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                  </svg>
                  Connect with dancers across Australia
                </li>
              </ul>
            </div>
            <div className="flex flex-col space-y-2 sm:space-y-3 w-full sm:w-auto">
              <Button
                onClick={() => setIsContactFormOpen(true)}
                className="bg-white text-primary px-4 sm:px-6 py-2 rounded-full font-semibold hover:bg-gray-50 transition-colors duration-200 text-center w-full sm:w-auto"
              >
                Contact Us
              </Button>
              <Link href="/calendar/add-events">
                <Button
                  className="bg-secondary text-white px-4 sm:px-6 py-2 rounded-full font-semibold hover:bg-secondary/90 transition-colors duration-200 text-center w-full sm:w-auto"
                >
                  Submit via Form
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <ContactForm
          isOpen={isContactFormOpen}
          onClose={() => setIsContactFormOpen(false)}
        />
      </div>
    </div>
  );
} 