"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Trophy, Medal, Calendar } from "lucide-react"

interface RankBadgeProps {
  rank: number;
}

export default function LeaderboardPage() {
  const competitions = [
    {
      id: 1,
      name: "NSW jack&Jill",
      date: "April 13, 2025",
      location: "Sydney",
      registrationLink: "https://www.facebook.com/groups/1268854410845691",
    },
    {
      id: 2,
      name: "Australia Bachata Championship",
      date: "March 15, 2025",
      location: "Sydney",
      registrationLink: "https://www.facebook.com/BachataChamp/",
    },
    {
      id: 3,
      name: "Melbourne Bachata Open",
      date: "April 22, 2025",
      location: "Melbourne",
      registrationLink: "https://events.bachata-australia.com/melbourne-open",
    },
    {
      id: 4,
      name: "Brisbane Bachata Festival Competition",
      date: "May 10, 2025",
      location: "Brisbane",
      registrationLink: "https://events.bachata-australia.com/brisbane-festival",
    },
  ]

  const leaders = [
    { id: 1, name: "Lionel Coevoet", points: 120, competitions: 5, rank: 1 },
    { id: 2, name: "Prakesh Sherna", points: 105, competitions: 4, rank: 2 },
    { id: 3, name: "James Wilson", points: 95, competitions: 5, rank: 3 },
    { id: 4, name: "Robert Taylor", points: 85, competitions: 3, rank: 4 },
    { id: 5, name: "John Smith", points: 75, competitions: 4, rank: 5 },
    { id: 6, name: "Daniel Brown", points: 70, competitions: 3, rank: 6 },
    { id: 7, name: "Thomas Lee", points: 65, competitions: 4, rank: 7 },
    { id: 8, name: "William Davis", points: 60, competitions: 3, rank: 8 },
    { id: 9, name: "Christopher Martin", points: 55, competitions: 3, rank: 9 },
    { id: 10, name: "Joseph Thompson", points: 50, competitions: 2, rank: 10 },
  ]

  const followers = [
    { id: 1, name: "Annie Kim", points: 125, competitions: 5, rank: 1 },
    { id: 2, name: "Emma Johnson", points: 110, competitions: 4, rank: 2 },
    { id: 3, name: "Olivia Williams", points: 100, competitions: 5, rank: 3 },
    { id: 4, name: "Isabella Brown", points: 90, competitions: 4, rank: 4 },
    { id: 5, name: "Ava Jones", points: 80, competitions: 3, rank: 5 },
    { id: 6, name: "Mia Davis", points: 75, competitions: 4, rank: 6 },
    { id: 7, name: "Charlotte Wilson", points: 70, competitions: 3, rank: 7 },
    { id: 8, name: "Amelia Taylor", points: 65, competitions: 3, rank: 8 },
    { id: 9, name: "Harper Anderson", points: 60, competitions: 3, rank: 9 },
    { id: 10, name: "Evelyn Thomas", points: 55, competitions: 2, rank: 10 },
  ]

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-primary mb-4">Jack & Jill Leaderboard</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Track the rankings of Australia's top Bachata dancers in Jack & Jill competitions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <Card className="bg-gradient-to-br from-primary/90 to-primary text-white">
            <CardHeader>
              <CardTitle className="flex items-center text-2xl">
                <Trophy className="h-6 w-6 mr-2" />
                Top Leader
              </CardTitle>
              <CardDescription className="text-white/80">Current season rankings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">{leaders[0].name}</div>
                <div className="text-xl">{leaders[0].points} points</div>
                <div className="text-white/80">{leaders[0].competitions} competitions</div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-secondary/90 to-secondary text-white">
            <CardHeader>
              <CardTitle className="flex items-center text-2xl">
                <Calendar className="h-6 w-6 mr-2" />
                Next Competition
              </CardTitle>
              <CardDescription className="text-white/80">Mark your calendar</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">{competitions[0].name}</div>
                <div className="text-xl">{competitions[0].date}</div>
                <div className="text-white/80">{competitions[0].location}</div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-primary/90 to-primary text-white">
            <CardHeader>
              <CardTitle className="flex items-center text-2xl">
                <Trophy className="h-6 w-6 mr-2" />
                Top Follower
              </CardTitle>
              <CardDescription className="text-white/80">Current season rankings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">{followers[0].name}</div>
                <div className="text-xl">{followers[0].points} points</div>
                <div className="text-white/80">{followers[0].competitions} competitions</div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="leaders" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="leaders" className="data-[state=active]:bg-primary data-[state=active]:text-white">Leaders</TabsTrigger>
            <TabsTrigger value="followers" className="data-[state=active]:bg-primary data-[state=active]:text-white">Followers</TabsTrigger>
          </TabsList>

          <TabsContent value="leaders" className="w-full">
            <Card>
              <CardHeader>
                <CardTitle className="text-primary">Leaders Leaderboard</CardTitle>
                <CardDescription>Rankings based on Jack & Jill competition results across Australia</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="px-4 py-3 text-left">Rank</th>
                        <th className="px-4 py-3 text-left">Name</th>
                        <th className="px-4 py-3 text-left">Points</th>
                        <th className="px-4 py-3 text-left">Competitions</th>
                        <th className="px-4 py-3 text-left">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {leaders.map((leader) => (
                        <tr key={leader.id} className="border-b hover:bg-gray-50">
                          <td className="px-4 py-3">
                            <RankBadge rank={leader.rank} />
                          </td>
                          <td className="px-4 py-3 font-medium">{leader.name}</td>
                          <td className="px-4 py-3">{leader.points}</td>
                          <td className="px-4 py-3">{leader.competitions}</td>
                          <td className="px-4 py-3">
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-primary border-primary hover:bg-primary/10"
                            >
                              View Profile
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="followers" className="w-full">
            <Card>
              <CardHeader>
                <CardTitle className="text-primary">Followers Leaderboard</CardTitle>
                <CardDescription>Rankings based on Jack & Jill competition results across Australia</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="px-4 py-3 text-left">Rank</th>
                        <th className="px-4 py-3 text-left">Name</th>
                        <th className="px-4 py-3 text-left">Points</th>
                        <th className="px-4 py-3 text-left">Competitions</th>
                        <th className="px-4 py-3 text-left">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {followers.map((follower) => (
                        <tr key={follower.id} className="border-b hover:bg-gray-50">
                          <td className="px-4 py-3">
                            <RankBadge rank={follower.rank} />
                          </td>
                          <td className="px-4 py-3 font-medium">{follower.name}</td>
                          <td className="px-4 py-3">{follower.points}</td>
                          <td className="px-4 py-3">{follower.competitions}</td>
                          <td className="px-4 py-3">
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-primary border-primary hover:bg-primary/10"
                            >
                              View Profile
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-12">
          <h2 className="text-2xl font-bold text-primary mb-6">Upcoming Competitions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {competitions.map((competition) => (
              <Card key={competition.id}>
                <CardHeader>
                  <CardTitle className="text-primary">{competition.name}</CardTitle>
                  <CardDescription>
                    {competition.date} • {competition.location}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Join this Jack & Jill competition to earn points and climb the leaderboard.
                  </p>
                  <Button
                    className="w-full bg-primary hover:bg-primary/90"
                    onClick={() => window.open(competition.registrationLink, "_blank", "noopener,noreferrer")}
                  >
                    Register Now
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function RankBadge({ rank }: RankBadgeProps) {
  if (rank === 1) {
    return (
      <div className="flex items-center">
        <Medal className="h-5 w-5 text-primary mr-1" />
        <span className="font-bold">{rank}</span>
      </div>
    )
  } else if (rank === 2) {
    return (
      <div className="flex items-center">
        <Medal className="h-5 w-5 text-gray-400 mr-1" />
        <span className="font-bold">{rank}</span>
      </div>
    )
  } else if (rank === 3) {
    return (
      <div className="flex items-center">
        <Medal className="h-5 w-5 text-amber-700 mr-1" />
        <span className="font-bold">{rank}</span>
      </div>
    )
  } else {
    return <span>{rank}</span>
  }
}
