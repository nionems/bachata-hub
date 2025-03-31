"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, MapPin, Users, Trophy, Clock, ArrowLeft } from "lucide-react"
import Link from "next/link"

// This would typically come from your database
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
    image: "/placeholder.svg?height=300&width=600",
    leaderboard: {
      leaders: [
        { id: 1, name: "Lionel Coevoet", points: 120, rank: 1 },
        { id: 2, name: "Prakesh Sherna", points: 105, rank: 2 },
        { id: 3, name: "James Wilson", points: 95, rank: 3 },
      ],
      followers: [
        { id: 1, name: "Annie Kim", points: 125, rank: 1 },
        { id: 2, name: "Emma Johnson", points: 110, rank: 2 },
        { id: 3, name: "Olivia Williams", points: 100, rank: 3 },
      ],
    },
  },
  // ... other competitions
]

export default function CompetitionDetailPage({ params }: { params: { id: string } }) {
  const competition = competitions.find((c) => c.id === parseInt(params.id))

  if (!competition) {
    return (
      <div className="container mx-auto py-12 px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Competition not found</h1>
          <Link href="/competition">
            <Button className="bg-green-600 hover:bg-green-700">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Competitions
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <Link href="/competition">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Competitions
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Competition Details */}
          <div className="lg:col-span-2">
            <Card className="overflow-hidden">
              <div className="relative h-64">
                <img
                  src={competition.image}
                  alt={competition.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <CardHeader>
                <CardTitle className="text-3xl">{competition.name}</CardTitle>
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
                    onClick={() => window.open(competition.registrationLink, "_blank", "noopener,noreferrer")}
                  >
                    Register Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Leaderboard */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Trophy className="h-5 w-5 mr-2 text-yellow-500" />
                  Leaderboard
                </CardTitle>
                <CardDescription>Top performers in this competition</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="leaders" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="leaders">Leaders</TabsTrigger>
                    <TabsTrigger value="followers">Followers</TabsTrigger>
                  </TabsList>

                  <TabsContent value="leaders">
                    <div className="space-y-4">
                      {competition.leaderboard.leaders.map((leader) => (
                        <div
                          key={leader.id}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                        >
                          <div className="flex items-center">
                            <div className="w-8 h-8 flex items-center justify-center bg-green-100 text-green-800 rounded-full font-semibold mr-3">
                              {leader.rank}
                            </div>
                            <div>
                              <div className="font-medium">{leader.name}</div>
                              <div className="text-sm text-gray-500">{leader.points} points</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="followers">
                    <div className="space-y-4">
                      {competition.leaderboard.followers.map((follower) => (
                        <div
                          key={follower.id}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                        >
                          <div className="flex items-center">
                            <div className="w-8 h-8 flex items-center justify-center bg-green-100 text-green-800 rounded-full font-semibold mr-3">
                              {follower.rank}
                            </div>
                            <div>
                              <div className="font-medium">{follower.name}</div>
                              <div className="text-sm text-gray-500">{follower.points} points</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
} 