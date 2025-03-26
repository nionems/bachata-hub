"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, MapPin, DollarSign, Users, Calendar, Clock, Building2, Wifi, ParkingCircle, Utensils, Dumbbell, Waves, Heart, MessageSquare, Share2, ChevronRight } from "lucide-react"
import CollapsibleFilter from "@/components/collapsible-filter"

interface Festival {
  id: string
  name: string
  date: string
  location: string
  state: string
  description: string
  image: string
}

interface Accommodation {
  id: string
  name: string
  festivalId: string
  location: string
  state: string
  price: string
  rating: number
  reviews: number
  amenities: string[]
  description: string
  image: string
  distance: string
  capacity: number
  checkIn: string
  checkOut: string
}

const festivals: Festival[] = [
  {
    id: "festival-1",
    name: "Bachata Festival Sydney 2024",
    date: "March 15-17, 2024",
    location: "Sydney Convention Centre",
    state: "NSW",
    description: "Australia's biggest bachata festival featuring world-class instructors and performers.",
    image: "/festivals/sydney-festival.jpg"
  },
  {
    id: "festival-2",
    name: "Melbourne Bachata Congress",
    date: "April 5-7, 2024",
    location: "Melbourne Exhibition Centre",
    state: "VIC",
    description: "A celebration of bachata music and dance in the heart of Melbourne.",
    image: "/festivals/melbourne-festival.jpg"
  },
  {
    id: "festival-3",
    name: "Brisbane Bachata Festival",
    date: "May 10-12, 2024",
    location: "Brisbane Convention Centre",
    state: "QLD",
    description: "The premier bachata event in Queensland.",
    image: "/festivals/brisbane-festival.jpg"
  }
]

const accommodations: Accommodation[] = [
  {
    id: "acc-1",
    festivalId: "festival-1",
    name: "Hilton Sydney",
    location: "488 George Street",
    state: "NSW",
    price: "$299",
    rating: 4.8,
    reviews: 124,
    amenities: ["wifi", "parking", "restaurant", "gym", "pool", "spa"],
    description: "Luxury hotel in the heart of Sydney with stunning views of the city.",
    image: "/accommodations/hilton-sydney.jpg",
    distance: "0.2 km from venue",
    capacity: 2,
    checkIn: "3:00 PM",
    checkOut: "11:00 AM"
  },
  {
    id: "acc-2",
    festivalId: "festival-1",
    name: "Meriton Suites",
    location: "528 Kent Street",
    state: "NSW",
    price: "$249",
    rating: 4.6,
    reviews: 89,
    amenities: ["wifi", "parking", "gym", "pool"],
    description: "Modern apartment-style accommodation with full kitchen facilities.",
    image: "/accommodations/meriton-suites.jpg",
    distance: "0.5 km from venue",
    capacity: 4,
    checkIn: "2:00 PM",
    checkOut: "10:00 AM"
  },
  {
    id: "acc-3",
    festivalId: "festival-2",
    name: "Crown Towers Melbourne",
    location: "8 Whiteman Street",
    state: "VIC",
    price: "$279",
    rating: 4.7,
    reviews: 156,
    amenities: ["wifi", "parking", "restaurant", "gym", "pool", "spa", "casino"],
    description: "Luxury hotel with world-class dining and entertainment options.",
    image: "/accommodations/crown-towers.jpg",
    distance: "0.3 km from venue",
    capacity: 2,
    checkIn: "3:00 PM",
    checkOut: "11:00 AM"
  },
  {
    id: "acc-4",
    festivalId: "festival-2",
    name: "Pan Pacific Melbourne",
    location: "2 Convention Centre Place",
    state: "VIC",
    price: "$259",
    rating: 4.5,
    reviews: 92,
    amenities: ["wifi", "parking", "restaurant", "gym", "pool"],
    description: "Modern hotel connected to the convention centre.",
    image: "/accommodations/pan-pacific.jpg",
    distance: "0.1 km from venue",
    capacity: 2,
    checkIn: "3:00 PM",
    checkOut: "11:00 AM"
  },
  {
    id: "acc-5",
    festivalId: "festival-3",
    name: "Sofitel Brisbane",
    location: "249 Turbot Street",
    state: "QLD",
    price: "$289",
    rating: 4.8,
    reviews: 143,
    amenities: ["wifi", "parking", "restaurant", "gym", "pool", "spa"],
    description: "Luxury French hotel with elegant rooms and city views.",
    image: "/accommodations/sofitel-brisbane.jpg",
    distance: "0.4 km from venue",
    capacity: 2,
    checkIn: "3:00 PM",
    checkOut: "11:00 AM"
  },
  {
    id: "acc-6",
    festivalId: "festival-3",
    name: "Brisbane Marriott",
    location: "515 Queen Street",
    state: "QLD",
    price: "$269",
    rating: 4.6,
    reviews: 98,
    amenities: ["wifi", "parking", "restaurant", "gym", "pool"],
    description: "Contemporary hotel with modern amenities and river views.",
    image: "/accommodations/marriott-brisbane.jpg",
    distance: "0.6 km from venue",
    capacity: 2,
    checkIn: "3:00 PM",
    checkOut: "11:00 AM"
  }
]

const stateFilter = [
  { value: "all", label: "All States" },
  { value: "NSW", label: "New South Wales" },
  { value: "VIC", label: "Victoria" },
  { value: "QLD", label: "Queensland" },
  { value: "WA", label: "Western Australia" },
  { value: "SA", label: "South Australia" },
  { value: "TAS", label: "Tasmania" },
  { value: "ACT", label: "Australian Capital Territory" },
  { value: "NT", label: "Northern Territory" }
]

export default function FestivalAccommodations() {
  const [selectedState, setSelectedState] = useState("all")
  const [selectedFestival, setSelectedFestival] = useState<string | null>(null)

  const filteredAccommodations = accommodations.filter(acc => {
    if (selectedState === "all") return true
    return acc.state === selectedState
  })

  return (
    <div className="container mx-auto px-4 py-4 sm:py-6 md:py-8">
      <div className="flex flex-col gap-4 sm:gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl sm:text-3xl font-bold">Festival Accommodations</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Find the perfect place to stay during your favorite bachata festivals</p>
        </div>

        <div className="flex flex-col gap-4">
          <CollapsibleFilter title="" showApplyButton={false}>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
              {stateFilter.map((state) => (
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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredAccommodations.map((accommodation) => {
              const festival = festivals.find(f => f.id === accommodation.festivalId)
              return (
                <Card key={accommodation.id} className="flex flex-col">
                  <CardHeader className="p-4 sm:p-6">
                    <div className="relative aspect-video mb-4">
                      <img
                        src={accommodation.image}
                        alt={accommodation.name}
                        className="object-cover rounded-lg"
                      />
                      <Badge className="absolute top-2 right-2 bg-white text-black hover:bg-white text-sm">
                        {accommodation.price}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg sm:text-xl">{accommodation.name}</CardTitle>
                    <CardDescription className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4" />
                      {accommodation.location}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow p-4 sm:p-6 pt-0">
                    <div className="flex items-center gap-2 mb-2">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium text-sm sm:text-base">{accommodation.rating}</span>
                      <span className="text-muted-foreground text-sm">({accommodation.reviews} reviews)</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">{accommodation.description}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center gap-1">
                        <Building2 className="h-4 w-4" />
                        <span>{accommodation.distance}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>Up to {accommodation.capacity} guests</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{accommodation.checkIn} - {accommodation.checkOut}</span>
                      </div>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {accommodation.amenities.map((amenity) => {
                        const icons: { [key: string]: any } = {
                          wifi: Wifi,
                          parking: ParkingCircle,
                          restaurant: Utensils,
                          gym: Dumbbell,
                          pool: Waves,
                          spa: Heart,
                          casino: DollarSign
                        }
                        const Icon = icons[amenity]
                        return Icon ? (
                          <Badge key={amenity} variant="secondary" className="flex items-center gap-1 text-xs sm:text-sm">
                            <Icon className="h-3 w-3" />
                            {amenity.charAt(0).toUpperCase() + amenity.slice(1)}
                          </Badge>
                        ) : null
                      })}
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between items-center p-4 sm:p-6 pt-0">
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-10 sm:w-10">
                        <Heart className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-10 sm:w-10">
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-10 sm:w-10">
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <Button className="text-sm sm:text-base">
                      Book Now
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </Button>
                  </CardFooter>
                </Card>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
