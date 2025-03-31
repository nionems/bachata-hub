"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, MapPin, Users, Trophy, Clock } from "lucide-react"
import Link from "next/link"

export default function CompetitionsPage() {
  const competitions = [
    {
      id: 1,
      name: "NSW Jack & Jill Championship",
      date: "April 13, 2025",
      time: "2:00 PM",
      location: "Sydney Dance Company",
      description: "Annual NSW Jack & Jill competition featuring the best dancers from across the state.",
      categories: ["Open", "Advanced", "Intermediate"],
      registrationLink: "https://www.facebook.com/groups/1268854410845691",
      image: "/images/nswjack&jill.jpg",
    },
    {
      id: 2,
      name: "Australia Bachata Championship",
      date: "March 15, 2025",
      time: "3:00 PM",
      location: "Sydney Convention Centre",
      description: "The biggest Bachata competition in Australia, featuring national and international competitors.",
      categories: ["Open", "Advanced", "Intermediate", "Amateur"],
      registrationLink: "https://www.facebook.com/BachataChamp/",
      image: "/placeholder.svg?height=300&width=600",
    },
    {
      id: 3,
      name: "Melbourne Bachata Open",
      date: "April 22, 2025",
      time: "1:00 PM",
      location: "Melbourne Convention Centre",
      description: "Melbourne's premier Bachata competition with multiple categories and workshops.",
      categories: ["Open", "Advanced", "Intermediate"],
      registrationLink: "https://events.bachata-australia.com/melbourne-open",
      image: "/placeholder.svg?height=300&width=600",
    },
    {
      id: 4,
      name: "Brisbane Bachata Festival Competition",
      date: "May 10, 2025",
      time: "2:30 PM",
      location: "Brisbane Convention Centre",
      description: "Part of the Brisbane Bachata Festival, featuring exciting competitions and performances.",
      categories: ["Open", "Advanced", "Intermediate", "Amateur"],
      registrationLink: "https://events.bachata-australia.com/brisbane-festival",
      image: "/placeholder.svg?height=300&width=600",
    },
  ]

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-yellow-500 bg-clip-text text-transparent mb-2">Bachata Competitions</h1>
          <p className="text-xl text-gray-600">
            Find Bachata competitions across Australia
          </p>
        </div>

        <Tabs defaultValue="upcoming" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="upcoming">Upcoming Competitions</TabsTrigger>
            <TabsTrigger value="past">Past Competitions</TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {competitions.map((competition) => (
                <Link href={`/competitions/${competition.id}`} key={competition.id}>
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                    <div className="relative h-48">
                      <img
                        src={competition.image}
                        alt={competition.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <CardHeader>
                      <CardTitle>{competition.name}</CardTitle>
                      <CardDescription className="flex items-center gap-4">
                        <span className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {competition.date}
                        </span>
                        <span className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {competition.time}
                        </span>
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center text-gray-600">
                          <MapPin className="h-4 w-4 mr-1" />
                          {competition.location}
                        </div>
                        <p className="text-gray-600">{competition.description}</p>
                        <div className="flex flex-wrap gap-2">
                          {competition.categories.map((category) => (
                            <span
                              key={category}
                              className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                            >
                              {category}
                            </span>
                          ))}
                        </div>
                        <Button
                          className="w-full bg-green-600 hover:bg-green-700"
                          onClick={(e) => {
                            e.preventDefault()
                            window.open(competition.registrationLink, "_blank", "noopener,noreferrer")
                          }}
                        >
                          Register Now
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="past" className="w-full">
            <div className="text-center py-12">
              <Trophy className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Past Competitions</h3>
              <p className="text-gray-600">
                Results and highlights from previous competitions will be available here soon.
              </p>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-12 bg-green-50 p-8 rounded-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Competition Guidelines</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Registration Process</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-600">
                <li>Click "Register Now" on your chosen competition</li>
                <li>Fill out the registration form with your details</li>
                <li>Select your competition category</li>
                <li>Complete payment if required</li>
                <li>Receive confirmation email with details</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Competition Rules</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-600">
                <li>Arrive at least 30 minutes before start time</li>
                <li>Bring valid ID for registration</li>
                <li>Follow dress code requirements</li>
                <li>Respect judges and fellow competitors</li>
                <li>Have fun and enjoy the experience!</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 