"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Star, Users, Clock, MapIcon, ChevronDown } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useState } from "react"
import CollapsibleFilter from "@/components/collapsible-filter"

interface Instructor {
  name: string
  specialty: string
  bio?: string
}

interface School {
  id: number
  name: string
  location: string
  address: string
  phone: string
  email: string
  website: string
  rating: number
  students: string
  description: string
  image: string
  classes: string[]
  featured?: boolean
  instructors?: Instructor[]
  state: string
}

export default function SchoolsPage() {
  const [selectedState, setSelectedState] = useState("all")
  const states = [
    { value: "all", label: "All States" },
    { value: "nsw", label: "New South Wales" },
    { value: "vic", label: "Victoria" },
    { value: "qld", label: "Queensland" },
    { value: "wa", label: "Western Australia" },
  ]

  const sydneySchools = [
    {
      id: 1,
      name: "Dance With Me Sydney",
      location: "Waterloo, Sydney, NSW",
      address: "4 James St, Waterloo NSW 2017",
      phone: "0411 445 969",
      email: "info@dancewithmesydney.com",
      website: "dancewithmesydney.com.au",
      rating: 4.9,
      students: "300+",
      description:
        "Offers Bachata classes,bachata styling, Salsa and reaggaton ",
      image: "/images/dwme.jpg",
      classes: [
        "Beginner",
        "Intermediate",
        "Advanced",
        "Team Choreography",
      ],
      featured: true,
      instructors: [
        {
          name: "Mitch Billic",
        },
      ],
    },
    {
      id: 2,
      name: "Latin Dance Australia (LDA)",
      location: "Glebe, NSW",
      address: "Glebe, NSW",
      phone: "(02) 9876 5432",
      email: "info@latindance.com.au",
      website: "latindance.com.au",
      rating: 4.8,
      students: "450+",
      description:
        "Offers classes in both Dominican Bachata and Bachata Sensual, catering to all levels from beginners to advanced dancers.",
      image: "/images/schools/lda.png",
      classes: ["Dominican Bachata", "Bachata Sensual", "Beginner", "Intermediate", "Advanced"],
    },
    {
      id: 3,
      name: "Salsa Suave",
      location: "Sydney CBD, NSW",
      address: "Sydney CBD, NSW",
      phone: "(02) 3456 7890",
      email: "contact@salsasuave.com.au",
      website: "salsasuave.com.au",
      rating: 4.7,
      students: "350+",
      description:
        "Provides an 8-week Bachata Dancing Course suitable for beginners, emphasizing foundational steps and techniques.",
      image: "/images/suave.jpeg",
      classes: ["Beginner", "Foundational Steps", "Techniques", "8-Week Course"],
    },
    {
      id: 4,
      name: "Latin Junction",
      location: "Rosebery, NSW",
      address: "Rosebery, NSW",
      phone: "(02) 6543 2109",
      email: "info@latinjunction.com",
      website: "latinjunction.com.au",
      rating: 4.6,
      students: "300+",
      description:
        "Offers Bachata dance classes focusing on various styles, including Modern, Fusion, Sensual, and traditional Dominican Bachata.",
      image: "/images/lj.png",
      classes: ["Modern Bachata", "Bachata Fusion", "Sensual Bachata", "Dominican Bachata"],
    },
    {
      id: 5,
      name: "R&M Latin Dance",
      location: "Broadway, NSW",
      address: "Broadway, NSW",
      phone: "(02) 8765 4321",
      email: "hello@salsabachatasydney.com",
      website: "salsabachatasydney.com",
      rating: 4.7,
      students: "250+",
      description:
        "Provides Salsa and Bachata dance classes, focusing on technique and musicality, suitable for dancers at various levels.",
      image: "/images/schools/r-and-m-latin-dance.jpg",
      classes: ["Technique", "Musicality", "Beginner", "Intermediate", "Advanced"],
    },
    {
      id: 6,
      name: "Tropical Soul Dance Studio",
      location: "Annandale, NSW",
      address: "Annandale, NSW",
      phone: "(02) 5678 1234",
      email: "info@tsdance.com.au",
      website: "tsdance.com.au",
      rating: 4.8,
      students: "280+",
      description:
        "Teaches three popular styles of Bachata: Bachata Moderna, Dominican Bachata, and Bachata Sensual, with classes available from beginner to advanced levels.",
      image: "/images/ts.png",
      classes: ["Bachata Moderna", "Dominican Bachata", "Bachata Sensual", "Beginner to Advanced"],
    },
    {
      id: 7,
      name: "Salsa Republic",
      location: "Broadway/Glebe, NSW",
      address: "Broadway/Glebe, NSW",
      phone: "(02) 4321 8765",
      email: "info@salsarepublic.com.au",
      website: "salsarepublic.com.au",
      rating: 4.6,
      students: "320+",
      description:
        "Provides a mix of Bachata Moderna, Dominican footwork, and Sensual Bachata, emphasizing lead-follow techniques, body movement, and isolations.",
      image: "/images/schools/salsa-republic.jpg",
      classes: ["Bachata Moderna", "Dominican Footwork", "Sensual Bachata", "Lead-Follow Techniques"],
    },
    {
      id: 8,
      name: "Sydney Salsa Classes",
      location: "Sydney, NSW",
      address: "Sydney, NSW",
      phone: "(02) 9876 1234",
      email: "info@sydneysalsaclasses.com.au",
      website: "sydneysalsaclasses.com.au",
      rating: 4.5,
      students: "220+",
      description:
        "Offers Bachata classes designed to build confidence on the dance floor, with courses ranging from foundational movements to advanced techniques.",
      image: "/images/schools/sydney-salsa-classes.jpg",
      classes: ["Confidence Building", "Foundational Movements", "Advanced Techniques"],
    },
    {
      id: 9,
      name: "Arthur Murray Dance Centres",
      location: "Sydney CBD and Chatswood, NSW",
      address: "Sydney CBD and Chatswood, NSW",
      phone: "(02) 1234 9876",
      email: "info@learntodance.com.au",
      website: "learntodance.com.au",
      rating: 4.7,
      students: "400+",
      description:
        "Tailors Bachata classes to individual learning styles and paces, offering a combination of private and group sessions.",
      image: "/images/schools/arthur-murray-dance-centres.jpg",
      classes: ["Private Lessons", "Group Sessions", "Personalized Learning"],
    },
    {
      id: 9,
      name: "FeelFree Dance",
      location: "Bondi, NSW",
      address: "Bondi, NSW",
      phone: "(02) 1234 9876",
      email: "info@learntodance.com.au",
      website: "feelfreedance.com.au",
      rating: 4.7,
      students: "400+",
      description:
        "Tailors Bachata classes to individual learning styles and paces, offering a combination of private and group sessions.",
      image: "/images/ff.jpg",
      classes: ["Private Lessons", "Group Sessions", "Personalized Learning"],
    },
  ]

  const melbourneSchools = [
    {
      id: 10,
      name: "Bachata Beats",
      location: "Melbourne, VIC",
      address: "Melbourne, VIC",
      phone: "(03) 1234 5678",
      email: "info@bachatabeats.com.au",
      website: "bachatabeats.com.au",
      rating: 4.8,
      students: "400+",
      description: "Specializes in Bachata classes and private lessons, focusing on technique and musicality.",
      image: "/images/schools/bachata-beats.jpg",
      classes: ["Technique", "Musicality", "Private Lessons", "Group Classes"],
    },
    {
      id: 11,
      name: "Cortés Dance",
      location: "Melbourne, VIC",
      address: "Melbourne, VIC",
      phone: "(03) 9876 5432",
      email: "info@cortesdance.com.au",
      website: "cortesdance.com.au",
      rating: 4.9,
      students: "450+",
      description:
        "Led by Pedro Gonzalez and Tiffany De Caires, offering classes in Salsa, Bachata, Merengue, Cha Cha Cha, and more.",
      image: "/images/schools/cortes-dance.jpg",
      classes: ["Bachata", "Salsa", "Merengue", "Cha Cha Cha"],
    },
    {
      id: 12,
      name: "The Salsa Foundation",
      location: "Melbourne, VIC",
      address: "Melbourne, VIC",
      phone: "(03) 3456 7890",
      email: "info@thesalsafoundation.com.au",
      website: "thesalsafoundation.com.au/bachata",
      rating: 4.7,
      students: "350+",
      description: "Offers free beginners Bachata classes and progressive levels, emphasizing social dancing skills.",
      image: "/images/schools/the-salsa-foundation.jpg",
      classes: ["Free Beginner Classes", "Progressive Levels", "Social Dancing Skills"],
    },
    {
      id: 13,
      name: "Bachata Corazon",
      location: "Melbourne, VIC",
      address: "Melbourne, VIC",
      phone: "(03) 6543 2109",
      email: "info@bachatacorazon.com.au",
      website: "bachatacorazon.com.au/bachata-classes",
      rating: 4.6,
      students: "300+",
      description: "Provides Bachata classes and social events, aiming to create a vibrant dance community.",
      image: "/images/schools/bachata-corazon.jpg",
      classes: ["Bachata Classes", "Social Events", "Community Building"],
    },
    {
      id: 14,
      name: "La Encantada Collective",
      location: "Melbourne, VIC",
      address: "Melbourne, VIC",
      phone: "(03) 8765 4321",
      email: "info@lec.dance",
      website: "lec.dance/bachata-melbourne",
      rating: 4.8,
      students: "380+",
      description: "Offers classes in Salsa, Bachata, and other Latin dance styles, catering to all levels.",
      image: "/images/schools/la-encantada-collective.jpg",
      classes: ["Bachata", "Salsa", "Latin Dance", "All Levels"],
    },
    {
      id: 15,
      name: "Melbourne Salsa",
      location: "Fitzroy and Collingwood, VIC",
      address: "Fitzroy and Collingwood, VIC",
      phone: "(03) 5678 1234",
      email: "info@melbournesalsa.com.au",
      website: "melbournesalsa.com.au/pages/bachata",
      rating: 4.7,
      students: "420+",
      description:
        "Provides Bachata classes with authentic international instructors, emphasizing enthusiasm and flow.",
      image: "/images/schools/melbourne-salsa.jpg",
      classes: ["International Instructors", "Enthusiasm", "Flow", "Authentic Bachata"],
    },
  ]

  const brisbaneSchools = [
    {
      id: 16,
      name: "Rio Rhythmics Latin Dance Academy",
      location: "West End, QLD",
      address: "West End, QLD",
      phone: "(07) 1234 5678",
      email: "info@riorhythmicsacademy.com",
      website: "riorhythmicsacademy.com",
      rating: 4.9,
      students: "500+",
      description: "Offers Bachata classes and social events, aiming to make a positive difference through dance.",
      image: "/images/schools/rio-rhythmics-latin-dance-academy.jpg",
      classes: ["Bachata Classes", "Social Events", "Community Impact"],
    },
    {
      id: 17,
      name: "Annabelle Weir Private Lessons",
      location: "Brisbane and Gold Coast, QLD",
      address: "Brisbane and Gold Coast, QLD",
      phone: "(07) 9876 5432",
      email: "info@annabelleweir.com",
      website: "annabelleweir.com",
      rating: 4.8,
      students: "150+",
      description:
        "Specializes in private Latin, Kizomba, and Bachata dance lessons, focusing on connection and expressivity.",
      image: "/images/schools/annabelle-weir-private-lessons.jpg",
      classes: ["Private Lessons", "Latin Dance", "Kizomba", "Bachata", "Connection", "Expressivity"],
    },
  ]

  const perthSchools = [
    {
      id: 18,
      name: "Latin Dance Calendar Perth",
      location: "Perth, WA",
      address: "Perth, WA",
      phone: "(08) 1234 5678",
      email: "info@latindancecalendar.com",
      website: "latindancecalendar.com",
      rating: 4.7,
      students: "300+",
      description: "A comprehensive directory of Bachata dance classes and events in Perth.",
      image: "/images/schools/latin-dance-calendar-perth.jpg",
      classes: ["Bachata Classes", "Events Directory", "Perth Dance Community"],
    },
  ]

  // Combine all schools into one array
  const allSchools = [
    ...sydneySchools.map(school => ({ ...school, state: "nsw" } as School)),
    ...melbourneSchools.map(school => ({ ...school, state: "vic" } as School)),
    ...brisbaneSchools.map(school => ({ ...school, state: "qld" } as School)),
    ...perthSchools.map(school => ({ ...school, state: "wa" } as School))
  ]

  // Filter schools based on selected state
  const filteredSchools = selectedState === "all" 
    ? allSchools 
    : allSchools.filter(school => school.state === selectedState)

  // Featured school (Dance With Me Sydney)
  const featuredSchool = filteredSchools.find((school) => school.featured)

  return (
    <div className="container mx-auto py-6 sm:py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-4">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">Bachata Schools in Australia</h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
            Find Bachata schools and instructors across Australia. Learn from experienced teachers and join the Bachata community.
          </p>
        </div>

        {/* State Filter */}
        <div className="mb-8">
          <CollapsibleFilter title="Filter by State" showApplyButton={false}>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
              {states.map((state) => (
                <Button
                  key={state.value}
                  variant={selectedState === state.value ? "default" : "outline"}
                  className={`w-full text-sm sm:text-base ${
                    selectedState === state.value
                      ? "bg-green-600 text-white hover:bg-green-700"
                      : "border-green-600 text-green-600 hover:bg-green-50"
                  }`}
                  onClick={() => setSelectedState(state.value)}
                >
                  {state.label}
                </Button>
              ))}
            </div>
          </CollapsibleFilter>
        </div>

        {/* Featured School */}
        {featuredSchool && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <Star className="h-6 w-6 text-yellow-500 mr-2 fill-yellow-500" />
              Featured School
            </h2>
            <Card className="overflow-hidden hover:shadow-lg transition-shadow border-yellow-300">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
                <div className="md:col-span-1">
                  <div className="h-full">
                    <img
                      src={featuredSchool.image || "/placeholder.svg"}
                      alt={featuredSchool.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div className="md:col-span-2 p-6">
                  <h3 className="text-2xl font-bold text-green-700 mb-2">{featuredSchool.name}</h3>
                  <div className="flex items-center mb-3">
                    <MapPin className="h-4 w-4 text-gray-500 mr-2" />
                    <span className="text-gray-600">{featuredSchool.location}</span>
                  </div>

                  <div className="flex items-center mb-4">
                    <Star className="h-4 w-4 text-yellow-500 mr-1 fill-yellow-500" />
                    <span className="font-medium mr-3">{featuredSchool.rating}</span>
                    <Users className="h-4 w-4 text-gray-500 mr-1" />
                    <span>{featuredSchool.students} students</span>
                  </div>

                  <p className="text-gray-700 mb-6">{featuredSchool.description}</p>

                  <div className="mb-6">
                    <h4 className="text-sm font-semibold mb-2 text-gray-600">Classes Offered:</h4>
                    <div className="flex flex-wrap gap-2">
                      {featuredSchool.classes.map((className, index) => (
                        <span key={index} className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm">
                          {className}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Add this new section for instructors */}
                  {featuredSchool.instructors && featuredSchool.instructors.length > 0 && (
                    <div className="mb-6">
                      <h4 className="text-sm font-semibold mb-2 text-gray-600">Featured Instructors:</h4>
                      <div className="space-y-3">
                        {featuredSchool.instructors.map((instructor, index) => (
                          <div key={index} className="bg-gray-50 p-3 rounded-md">
                            <div className="font-medium text-green-700">{instructor.name}</div>
                            <div className="text-sm text-gray-600">{instructor.specialty}</div>
                            <div className="text-sm text-gray-700 mt-1">{instructor.bio}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-3">
                    <a href={`https://${featuredSchool.website}`} target="_blank" rel="noopener noreferrer">
                      <Button className="bg-yellow-500 hover:bg-yellow-600 text-black">Visit Website</Button>
                    </a>
                    <Link href={`/schools/${featuredSchool.id}`}>
                      <Button variant="outline" className="border-green-600 text-green-600 hover:bg-green-50">
                        View Details
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Schools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {filteredSchools
            .filter((school) => !school.featured)
            .map((school) => (
              <SchoolCard key={school.id} school={school} />
            ))}
        </div>

        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Own a Bachata School?</h2>
          <p className="text-lg text-gray-700 mb-6 max-w-2xl mx-auto">
            List your school on Bachata Australia to reach more students and grow your community.
          </p>
          <Button className="bg-green-600 hover:bg-green-700 text-white">Add Your School</Button>
        </div>
      </div>
    </div>
  )
}

// School Card Component
function SchoolCard({ school }: { school: School }) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full flex flex-col">
      <div className="h-48 overflow-hidden">
        <img
          src={school.image || "/placeholder.svg"}
          alt={school.name}
          className="w-full h-full object-cover transition-transform hover:scale-105"
        />
      </div>
      <CardHeader>
        <CardTitle className="text-xl text-green-700">{school.name}</CardTitle>
        <CardDescription className="flex items-center">
          <MapPin className="h-4 w-4 mr-2" />
          {school.location}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="flex items-center mb-3">
          <Star className="h-4 w-4 text-yellow-500 mr-1 fill-yellow-500" />
          <span className="font-medium">{school.rating}</span>
          <span className="mx-2 text-gray-400">•</span>
          <Users className="h-4 w-4 text-gray-500 mr-1" />
          <span>{school.students} students</span>
        </div>

        <p className="text-gray-700 mb-4">{school.description}</p>

        <div className="mb-4">
          <h3 className="text-sm font-semibold mb-2 text-gray-600">Classes Offered:</h3>
          <div className="flex flex-wrap gap-2">
            {school.classes.map((className: string, index: number) => (
              <span key={index} className="bg-green-50 text-green-700 px-2 py-1 rounded-full text-xs">
                {className}
              </span>
            ))}
          </div>
        </div>

        {/* Add this new section for instructors */}
        {school.instructors && school.instructors.length > 0 && (
          <div className="mb-4">
            <h3 className="text-sm font-semibold mb-2 text-gray-600">Featured Instructors:</h3>
            <div className="space-y-2">
              {school.instructors.map((instructor: Instructor, index: number) => (
                <div key={index} className="text-xs text-gray-700">
                  <span className="font-medium">{instructor.name}</span> - {instructor.specialty}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="border-t pt-4">
        <div className="w-full flex flex-col gap-3">
          <a href={`https://${school.website}`} target="_blank" rel="noopener noreferrer" className="w-full">
            <Button className="w-full bg-yellow-500 hover:bg-yellow-600 text-black">Visit Website</Button>
          </a>
          <Link href={`/schools/${school.id}`} className="w-full">
            <Button variant="outline" className="w-full border-green-600 text-green-600 hover:bg-green-50">
              <Clock className="h-4 w-4 mr-2" />
              View Details
            </Button>
          </Link>
        </div>
      </CardFooter>
    </Card>
  )
}
