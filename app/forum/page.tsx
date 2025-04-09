import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageSquare, Users, Calendar, Pin, MessageCircle, Eye } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Topic {
  id: number
  title: string
  author: string
  date: string
  replies: number
  views: number
  category: string
  pinned: boolean
}

export default function ForumPage() {
  const categories = [
    {
      id: 1,
      name: "General Discussion",
      description: "General discussions about Bachata dancing in Australia",
      topics: 156,
      posts: 1243,
      icon: <MessageSquare className="h-10 w-10 text-green-600" />,
    },
    {
      id: 2,
      name: "Events & Festivals",
      description: "Discuss upcoming Bachata events and festivals",
      topics: 98,
      posts: 876,
      icon: <Calendar className="h-10 w-10 text-yellow-500" />,
    },
    {
      id: 3,
      name: "Technique & Learning",
      description: "Share tips, ask questions, and discuss Bachata techniques",
      topics: 124,
      posts: 1087,
      icon: <Users className="h-10 w-10 text-green-600" />,
    },
    {
      id: 4,
      name: "Music & Artists",
      description: "Discuss Bachata music, artists, and songs",
      topics: 87,
      posts: 654,
      icon: <MessageSquare className="h-10 w-10 text-yellow-500" />,
    },
    {
      id: 5,
      name: "Schools & Instructors",
      description: "Discuss Bachata schools and instructors in Australia",
      topics: 76,
      posts: 543,
      icon: <Users className="h-10 w-10 text-green-600" />,
    },
    {
      id: 6,
      name: "Marketplace",
      description: "Buy, sell, or trade dance-related items",
      topics: 65,
      posts: 432,
      icon: <MessageSquare className="h-10 w-10 text-yellow-500" />,
    },
  ]

  const recentTopics = [
    {
      id: 1,
      title: "Sydney Bachata Festival 2025 - Who's going?",
      author: "DanceLover123",
      date: "2 hours ago",
      replies: 24,
      views: 156,
      category: "Events & Festivals",
      pinned: true,
    },
    {
      id: 2,
      title: "Best shoes for Bachata dancing?",
      author: "NewDancer",
      date: "5 hours ago",
      replies: 18,
      views: 98,
      category: "General Discussion",
      pinned: false,
    },
    {
      id: 3,
      title: "Tips for improving body movement in Bachata",
      author: "BachataPro",
      date: "Yesterday",
      replies: 32,
      views: 210,
      category: "Technique & Learning",
      pinned: false,
    },
    {
      id: 4,
      title: "New Bachata song recommendations",
      author: "MusicLover",
      date: "2 days ago",
      replies: 15,
      views: 87,
      category: "Music & Artists",
      pinned: false,
    },
    {
      id: 5,
      title: "Looking for a dance partner in Melbourne",
      author: "MelbourneDancer",
      date: "3 days ago",
      replies: 9,
      views: 76,
      category: "General Discussion",
      pinned: false,
    },
  ]

  const popularTopics = [
    {
      id: 1,
      title: "The ultimate guide to Bachata styles",
      author: "BachataMaster",
      date: "1 week ago",
      replies: 87,
      views: 1243,
      category: "Technique & Learning",
      pinned: false,
    },
    {
      id: 2,
      title: "2025 Australian Bachata Championships - Discussion",
      author: "CompetitionFan",
      date: "2 weeks ago",
      replies: 65,
      views: 876,
      category: "Events & Festivals",
      pinned: false,
    },
    {
      id: 3,
      title: "Best Bachata schools in Sydney - Reviews",
      author: "SydneyDancer",
      date: "3 weeks ago",
      replies: 54,
      views: 765,
      category: "Schools & Instructors",
      pinned: false,
    },
    {
      id: 4,
      title: "Evolution of Bachata music - Discussion",
      author: "MusicHistorian",
      date: "1 month ago",
      replies: 76,
      views: 987,
      category: "Music & Artists",
      pinned: false,
    },
    {
      id: 5,
      title: "Dance floor etiquette - What you need to know",
      author: "RespectfulDancer",
      date: "1 month ago",
      replies: 98,
      views: 1432,
      category: "General Discussion",
      pinned: false,
    },
  ]

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">Forum</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Connect with the Australian Bachata community. Ask questions, share experiences, and discuss all things
            Bachata.
          </p>
        </div>

        <div className="flex justify-between items-center mb-8">
          <div className="flex space-x-4">
            <Button className="bg-green-600 hover:bg-green-700 text-white">
              <MessageCircle className="h-4 w-4 mr-2" />
              New Topic
            </Button>
            <Button variant="outline" className="border-green-600 text-green-600 hover:bg-green-50">
              <Users className="h-4 w-4 mr-2" />
              Members
            </Button>
          </div>
          <div className="relative">
            <input
              type="text"
              placeholder="Search forum..."
              className="px-4 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
            <svg
              className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {categories.map((category) => (
            <Link key={category.id} href={`/forum/categories/${category.id}`}>
              <Card className="hover:shadow-md transition-shadow h-full">
                <CardHeader className="flex flex-row items-start space-x-4 pb-2">
                  <div className="mt-1">{category.icon}</div>
                  <div>
                    <CardTitle className="text-xl text-green-700">{category.name}</CardTitle>
                    <CardDescription className="mt-1">{category.description}</CardDescription>
                  </div>
                </CardHeader>
                <CardFooter className="border-t pt-4 text-sm text-gray-600">
                  <div className="flex justify-between w-full">
                    <span>{category.topics} topics</span>
                    <span>{category.posts} posts</span>
                  </div>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>

        <Tabs defaultValue="recent" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="recent">Recent Topics</TabsTrigger>
            <TabsTrigger value="popular">Popular Topics</TabsTrigger>
          </TabsList>

          <TabsContent value="recent" className="w-full">
            <Card>
              <CardHeader>
                <CardTitle>Recent Discussions</CardTitle>
                <CardDescription>The latest topics from the Bachata Australia community</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentTopics.map((topic) => (
                    <TopicRow key={topic.id} topic={topic} />
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex justify-center border-t pt-4">
                <Button variant="outline" className="border-green-600 text-green-600 hover:bg-green-50">
                  View More Topics
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="popular" className="w-full">
            <Card>
              <CardHeader>
                <CardTitle>Popular Discussions</CardTitle>
                <CardDescription>The most active topics from the Bachata Australia community</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {popularTopics.map((topic) => (
                    <TopicRow key={topic.id} topic={topic} />
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex justify-center border-t pt-4">
                <Button variant="outline" className="border-green-600 text-green-600 hover:bg-green-50">
                  View More Topics
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-12 bg-gradient-to-r from-primary to-secondary rounded-lg p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Join Our Community</h2>
          <p className="text-lg mb-6 max-w-2xl mx-auto">
            Sign up to participate in discussions, get help from experienced dancers, and connect with the Australian
            Bachata community.
          </p>
          <Button className="bg-black hover:bg-gray-800 text-white">Register Now</Button>
        </div>
      </div>
    </div>
  )
}

function TopicRow({ topic }: { topic: Topic }) {
  return (
    <div className="flex items-center justify-between p-4 border-b last:border-b-0 hover:bg-gray-50">
      <div className="flex-1">
        <div className="flex items-center space-x-2">
          {topic.pinned && <Pin className="h-4 w-4 text-green-600" />}
          <Link href={`/forum/topics/${topic.id}`} className="font-medium text-green-700 hover:text-green-800">
            {topic.title}
          </Link>
        </div>
        <div className="text-sm text-gray-600 mt-1">
          Posted by {topic.author} in {topic.category} • {topic.date}
        </div>
      </div>
      <div className="flex items-center space-x-4 text-sm text-gray-600">
        <div className="flex items-center">
          <MessageCircle className="h-4 w-4 mr-1" />
          {topic.replies}
        </div>
        <div className="flex items-center">
          <Eye className="h-4 w-4 mr-1" />
          {topic.views}
        </div>
      </div>
    </div>
  )
}
