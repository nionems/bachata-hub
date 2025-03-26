import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Star, Calendar, Instagram, Facebook, Youtube } from "lucide-react"

export default function InstructorsPage() {
  const instructors = [
    {
      id: 1,
      name: "Maria Rodriguez",
      location: "Sydney, NSW",
      specialty: "Dominican Bachata",
      experience: "10+ years",
      bio: "International Bachata champion and instructor specializing in authentic Dominican style with a modern twist.",
      image: "/placeholder.svg?height=300&width=300",
      rating: 4.9,
      school: "Sydney Bachata Academy",
      social: {
        instagram: "maria_bachata",
        facebook: "mariarodriguez",
        youtube: "mariabachata",
      },
    },
    {
      id: 2,
      name: "David Chen",
      location: "Melbourne, VIC",
      specialty: "Modern Bachata Fusion",
      experience: "8+ years",
      bio: "Known for his creative choreography and fusion of Bachata with contemporary dance styles.",
      image: "/placeholder.svg?height=300&width=300",
      rating: 4.8,
      school: "Melbourne Bachata School",
      social: {
        instagram: "david_bachata",
        facebook: "davidchen",
        youtube: "davidbachatafusion",
      },
    },
    {
      id: 3,
      name: "Sophia Martinez",
      location: "Brisbane, QLD",
      specialty: "Ladies Styling",
      experience: "12+ years",
      bio: "Renowned for her elegant styling techniques and empowering approach to teaching women's Bachata movement.",
      image: "/placeholder.svg?height=300&width=300",
      rating: 4.9,
      school: "Brisbane Bachata Institute",
      social: {
        instagram: "sophia_styling",
        facebook: "sophiamartinez",
        youtube: "sophiabachata",
      },
    },
    {
      id: 4,
      name: "Michael Wilson",
      location: "Perth, WA",
      specialty: "Sensual Bachata",
      experience: "9+ years",
      bio: "Specializes in sensual Bachata with a focus on connection, musicality, and fluid movement patterns.",
      image: "/placeholder.svg?height=300&width=300",
      rating: 4.7,
      school: "Perth Dance Studio",
      social: {
        instagram: "michael_sensual",
        facebook: "michaelwilson",
        youtube: "michaelbachata",
      },
    },
    {
      id: 5,
      name: "Emma Johnson",
      location: "Adelaide, SA",
      specialty: "Traditional & Modern Bachata",
      experience: "7+ years",
      bio: "Versatile instructor skilled in both traditional and modern Bachata styles with a focus on technique.",
      image: "/placeholder.svg?height=300&width=300",
      rating: 4.8,
      school: "Adelaide Bachata Center",
      social: {
        instagram: "emma_bachata",
        facebook: "emmajohnson",
        youtube: "emmabachata",
      },
    },
    {
      id: 6,
      name: "Carlos Sanchez",
      location: "Gold Coast, QLD",
      specialty: "Bachata Musicality",
      experience: "15+ years",
      bio: "Master instructor with deep knowledge of Bachata music, rhythm, and authentic Dominican movement.",
      image: "/placeholder.svg?height=300&width=300",
      rating: 4.9,
      school: "Gold Coast Dance Academy",
      social: {
        instagram: "carlos_bachata",
        facebook: "carlossanchez",
        youtube: "carlosbachata",
      },
    },
    {
      id: 7,
      name: "Olivia Brown",
      location: "Sydney, NSW",
      specialty: "Performance Choreography",
      experience: "8+ years",
      bio: "Choreographer and performer known for creating dynamic Bachata routines for shows and competitions.",
      image: "/placeholder.svg?height=300&width=300",
      rating: 4.7,
      school: "Sydney Bachata Academy",
      social: {
        instagram: "olivia_choreo",
        facebook: "oliviabrown",
        youtube: "oliviabachata",
      },
    },
    {
      id: 8,
      name: "James Taylor",
      location: "Melbourne, VIC",
      specialty: "Bachata Partnerwork",
      experience: "11+ years",
      bio: "Expert in advanced partnerwork techniques, focusing on lead and follow dynamics and creative patterns.",
      image: "/placeholder.svg?height=300&width=300",
      rating: 4.8,
      school: "Melbourne Bachata School",
      social: {
        instagram: "james_bachata",
        facebook: "jamestaylor",
        youtube: "jamesbachata",
      },
    },
    {
      id: 9,
      name: "Isabella Garcia",
      location: "Brisbane, QLD",
      specialty: "Urban Bachata",
      experience: "6+ years",
      bio: "Bringing fresh urban influences to Bachata, Isabella is known for her dynamic and contemporary style.",
      image: "/placeholder.svg?height=300&width=300",
      rating: 4.7,
      school: "Brisbane Bachata Institute",
      social: {
        instagram: "isabella_urban",
        facebook: "isabellagarcia",
        youtube: "isabellabachata",
      },
    },
  ]

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Bachata Instructors in Australia</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Learn from Australia's top Bachata instructors, each bringing their unique style and expertise to help you
            become a better dancer.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {instructors.map((instructor) => (
            <Card
              key={instructor.id}
              className="overflow-hidden hover:shadow-lg transition-shadow h-full flex flex-col"
            >
              <div className="relative pt-[100%] overflow-hidden bg-gray-100">
                <img
                  src={instructor.image || "/placeholder.svg"}
                  alt={instructor.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform hover:scale-105"
                />
              </div>
              <CardHeader>
                <CardTitle className="text-xl text-green-700">{instructor.name}</CardTitle>
                <CardDescription className="flex items-center justify-between">
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2" />
                    {instructor.location}
                  </div>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-500 mr-1" />
                    <span>{instructor.rating}</span>
                  </div>
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="mb-3">
                  <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                    {instructor.specialty}
                  </span>
                  <span className="inline-block ml-2 text-gray-600 text-sm">{instructor.experience} experience</span>
                </div>

                <p className="text-gray-700 mb-4">{instructor.bio}</p>

                <div className="text-sm text-gray-600 mb-3">
                  <span className="font-medium">School:</span> {instructor.school}
                </div>

                <div className="flex space-x-3">
                  <SocialLink
                    icon={<Instagram className="h-4 w-4" />}
                    username={instructor.social.instagram}
                    platform="instagram"
                  />
                  <SocialLink
                    icon={<Facebook className="h-4 w-4" />}
                    username={instructor.social.facebook}
                    platform="facebook"
                  />
                  <SocialLink
                    icon={<Youtube className="h-4 w-4" />}
                    username={instructor.social.youtube}
                    platform="youtube"
                  />
                </div>
              </CardContent>
              <CardFooter className="border-t pt-4">
                <div className="w-full flex flex-col gap-3">
                  <Link href={`/instructors/${instructor.id}`} className="w-full">
                    <Button className="w-full bg-yellow-500 hover:bg-yellow-600 text-black">View Profile</Button>
                  </Link>
                  <Link href={`/instructors/${instructor.id}#classes`} className="w-full">
                    <Button variant="outline" className="w-full border-green-600 text-green-600 hover:bg-green-50">
                      <Calendar className="h-4 w-4 mr-2" />
                      Book Classes
                    </Button>
                  </Link>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="bg-gradient-to-r from-green-600 to-yellow-500 rounded-lg p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-4">Are You a Bachata Instructor?</h2>
          <p className="text-lg mb-6 max-w-2xl mx-auto">
            Join our directory to connect with students and promote your classes across Australia.
          </p>
          <Button className="bg-white text-green-700 hover:bg-gray-100">Join as Instructor</Button>
        </div>
      </div>
    </div>
  )
}

function SocialLink({ icon, username, platform }) {
  return (
    <a
      href={`https://${platform}.com/${username}`}
      target="_blank"
      rel="noopener noreferrer"
      className="text-gray-500 hover:text-gray-700 flex items-center"
    >
      {icon}
      <span className="ml-1 text-sm">{username}</span>
    </a>
  )
}
