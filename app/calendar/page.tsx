'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Calendar, Users, Info } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { ContactForm } from "@/components/ContactForm";
import CalendarMenu from "@/components/calendar-menu";

export default function CalendarPage() {
  const [isContactFormOpen, setIsContactFormOpen] = useState(false);
  const [isSubmissionFormOpen, setIsSubmissionFormOpen] = useState(false);

  return (
    <div className="container mx-auto py-4 sm:py-6 px-3 sm:px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2 sm:mb-4">Bachata Calendar</h1>
          <p className="text-base sm:text-xl text-gray-600">
          Never miss a beat — explore every Bachata event across Australia in one calendar.
          </p>
        </div>

        <CalendarMenu />

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
          </div>

          <div className="lg:w-3/4">
            <Card>
              <CardHeader className="p-3 sm:p-4">
                <CardTitle className="text-base sm:text-lg md:text-xl">About Our Calendar</CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  Learn more about how to use and contribute to our calendar
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
        <div className="mt-8 sm:mt-12 bg-gradient-to-r from-primary to-secondary rounded-xl shadow-xl overflow-hidden">
          <div className="p-8 md:p-12 flex flex-col md:flex-row items-center justify-between">
            <div className="text-white mb-6 md:mb-0 md:mr-8">
              <h2 className="text-3xl font-bold mb-4">
                Add Your Event to Our Calendars
              </h2>
              <p className="text-white/90 text-lg mb-6">
                Have a Bachata event you'd like to add to our calendars? Get it featured and reach dancers across Australia!
              </p>
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