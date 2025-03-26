import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Calendar, Wifi, Car, Coffee, Star, Filter, ChevronDown } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Festival {
  id: number;
  name: string;
  date: string;
}

interface Accommodation {
  id: number;
  name: string;
  type: string;
  location: string;
  distance: string;
  price: string;
  rating: number;
  reviews: number;
  image: string;
  amenities: string[];
  festival: number;
  special: string;
}

export default function AccommodationPage() {
  const festivals: Festival[] = [
    { id: 1, name: "NSW", date: "2025" },
    { id: 2, name: "VIC", date: "2025" },
    { id: 3, name: "QLD", date: "2025" },
    { id: 4, name: "SA", date: "2025" },
    { id: 5, name: "WA", date: "2025" },
  ]

  const accommodations: Accommodation[] = [
    {
      id: 1,
      name: "Adelaide Sensual Weekend 2025",
      type: "House",
      location: "Adelaide",
      distance: "0.5 km from venue",
      price: "From $230 4 nights",
      rating: 4.7,
      reviews: 124,
      image: "/placeholder.svg?height=300&width=500",
      amenities: ["Free WiFi", "Parking", "Dance Floor"],
      festival: 4,
      special: "MAX 11 pax",
    },
    {
      id: 2,
      name: "Bachata Flavour 2025",
      type: "Apartment",
      location: "Melbourne CBD",
      distance: "0.5 km from venue",
      price: "From $200 4 night",
      rating: 4.5,
      reviews: 87,
      image: "/placeholder.svg?height=300&width=500",
      amenities: ["Free WiFi", "Kitchen", "Washing Machine", "Balcony"],
      festival: 2,
      special: "Group Discount Available",
    },
    {
      id: 3,
      name: "Melnourne Bachata Festival 2025",
      type: "House",
      location: "Melbourne",
      distance: "3.8 km from venue",
      price: "From $180 4 nights",
      rating: 4.8,
      reviews: 156,
      image: "/placeholder.svg?height=300&width=500",
      amenities: ["Free WiFi", "Parking", "Garden", "BBQ"],
      festival: 2,
      special: "Early Bird Discount",
    },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4 md:mb-0">Festival Accommodation</h1>
        <div className="flex gap-4">
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filters
            <ChevronDown className="h-4 w-4" />
          </Button>
          <Button>Sort by</Button>
        </div>
        </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="all">All Festivals</TabsTrigger>
            {festivals.map((festival) => (
            <TabsTrigger key={festival.id} value={festival.name.toLowerCase()}>
                {festival.name}
              </TabsTrigger>
            ))}
          </TabsList>

        <TabsContent value="all" className="space-y-6">
          {accommodations.map((accommodation) => (
            <AccommodationCard key={accommodation.id} accommodation={accommodation} />
          ))}
        </TabsContent>

          {festivals.map((festival) => (
          <TabsContent key={festival.id} value={festival.name.toLowerCase()}>
                  <div className="space-y-6">
                    {accommodations
                .filter((acc) => acc.festival === festival.id)
                      .map((accommodation) => (
                        <AccommodationCard key={accommodation.id} accommodation={accommodation} />
                      ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
    </div>
  )
}

function AccommodationCard({ accommodation }: { accommodation: Accommodation }) {
  return (
    <Card className="overflow-hidden">
      <div className="flex flex-col md:flex-row">
        <div className="md:w-1/3">
          <img
            src={accommodation.image}
            alt={accommodation.name}
            className="w-full h-48 md:h-full object-cover"
          />
        </div>
        <div className="md:w-2/3">
          <CardHeader>
          <div className="flex justify-between items-start">
            <div>
                <CardTitle className="text-xl mb-2">{accommodation.name}</CardTitle>
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="h-4 w-4" />
                  <span>{accommodation.location}</span>
                  <span>•</span>
                  <span>{accommodation.distance}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-semibold text-green-600">{accommodation.price}</div>
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span>{accommodation.rating}</span>
                  <span>({accommodation.reviews} reviews)</span>
                </div>
            </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2 mb-4">
              {accommodation.amenities.map((amenity) => (
                <AmenityBadge key={amenity} amenity={amenity} />
              ))}
            </div>
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-600">
                <span className="font-semibold">Special Offer:</span> {accommodation.special}
          </div>
              <Button>View Details</Button>
            </div>
          </CardContent>
        </div>
      </div>
    </Card>
  )
}

function AmenityBadge({ amenity }: { amenity: string }) {
  const getIcon = (amenity: string) => {
    switch (amenity.toLowerCase()) {
      case "free wifi":
        return <Wifi className="h-4 w-4" />
      case "parking":
        return <Car className="h-4 w-4" />
      case "kitchen":
        return <Coffee className="h-4 w-4" />
      default:
        return null
    }
  }

  return (
    <div className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-full text-sm text-gray-600">
      {getIcon(amenity)}
      <span>{amenity}</span>
    </div>
  )
}
