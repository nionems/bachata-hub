import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Calendar, Wifi, Car, Coffee, Star, Filter, ChevronDown } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function AccommodationPage() {
  const festivals = [
    { id: 1, name: "NSW", date: "2025" },
    { id: 2, name: "VIC", date: "2025" },
    { id: 3, name: "QLD", date: "2025" },
    { id: 4, name: "SA", date: "2025" },
    { id: 5, name: "WA", date: "2025" },
  ]

  const accommodations = [
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
      price: "From $200 4 night",
      rating: 4.2,
      reviews: 156,
      image: "/placeholder.svg?height=300&width=500",
      amenities: ["Free WiFi", "Shared Kitchen", "Lounge Area", "Lockers"],
      festival: 2,
      special: "Dancer's Dorm Available",
    },
    {
      id: 4,
      name: "Level UP",
      type: "Hotel",
      location: "Brisbane",
      distance: "0.5 km from venue",
      price: "From $150 per night",
      rating: 4.9,
      reviews: 92,
      image: "/placeholder.svg?height=300&width=500",
      amenities: ["Free WiFi", "Breakfast Included", "Spa", "Pool", "Restaurant"],
      festival: 3,
      special: "VIP Package Available",
    },
    {
      id: 5,
      name: "bailando sensual week end 2025",
      type: "Appartment",
      location: "Sydney",
      distance: "0.2 km from venue",
      price: "From $250 4 night",
      rating: 4.6,
      reviews: 108,
      image: "/placeholder.svg?height=300&width=500",
      amenities: ["Free WiFi", "Breakfast Included"],
      festival: 1,
      special: "Official Festival Hotel",
    },
    
  ]

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Festival Accommodation</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Find the perfect place to stay during Bachata festivals across Australia. From official festival hotels to
            budget-friendly options.
          </p>
        </div>

        <Tabs defaultValue="1" className="w-full mb-12">
          <TabsList className="grid w-full grid-cols-5 mb-8">
            {festivals.map((festival) => (
              <TabsTrigger key={festival.id} value={festival.id.toString()}>
                {festival.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {festivals.map((festival) => (
            <TabsContent key={festival.id} value={festival.id.toString()} className="w-full">
              <div className="mb-8">
                <Card className="bg-gradient-to-r from-green-600 to-yellow-500 text-white">
                  <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                      <div>
                        <h2 className="text-2xl font-bold mb-2">{festival.name}</h2>
                        <div className="flex items-center">
                          <Calendar className="h-5 w-5 mr-2" />
                          <span>{festival.date}</span>
                        </div>
                      </div>
                      <div className="mt-4 md:mt-0">
                        <Link href={`/festivals/${festival.id}`}>
                          <Button className="bg-white text-green-700 hover:bg-gray-100">View Festival Details</Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="flex flex-col md:flex-row gap-8">
                <div className="md:w-1/4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Filter className="h-5 w-5 mr-2" />
                        Filters
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div>
                          <h3 className="font-medium mb-3">Accommodation Type</h3>
                          <div className="space-y-2">
                            <FilterCheckbox id="hotel" label="Hotel" />
                            <FilterCheckbox id="apartment" label="Apartment" />
                            <FilterCheckbox id="hostel" label="Hostel" />
                            <FilterCheckbox id="house" label="House" />
                          </div>
                        </div>

                        <div>
                          <h3 className="font-medium mb-3">Price Range</h3>
                          <div className="space-y-2">
                            <FilterCheckbox id="under100" label="Under $100" />
                            <FilterCheckbox id="100to200" label="$100 - $200" />
                            <FilterCheckbox id="over200" label="Over $200" />
                          </div>
                        </div>

                        <div>
                          <h3 className="font-medium mb-3">Amenities</h3>
                          <div className="space-y-2">
                            <FilterCheckbox id="wifi" label="Free WiFi" />
                            <FilterCheckbox id="breakfast" label="Breakfast Included" />
                            <FilterCheckbox id="parking" label="Parking" />
                            <FilterCheckbox id="kitchen" label="Kitchen" />
                          </div>
                        </div>

                        <div>
                          <h3 className="font-medium mb-3">Distance from Venue</h3>
                          <div className="space-y-2">
                            <FilterCheckbox id="under1km" label="Under 1 km" />
                            <FilterCheckbox id="1to3km" label="1 - 3 km" />
                            <FilterCheckbox id="over3km" label="Over 3 km" />
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 pt-6 border-t">
                        <Button className="w-full bg-green-600 hover:bg-green-700">Apply Filters</Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="md:w-3/4">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Available Accommodations</h2>
                    <div className="flex items-center">
                      <span className="text-gray-600 mr-2">Sort by:</span>
                      <div className="relative">
                        <select className="appearance-none bg-white border border-gray-300 rounded-md py-2 pl-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500">
                          <option>Recommended</option>
                          <option>Price: Low to High</option>
                          <option>Price: High to Low</option>
                          <option>Distance</option>
                          <option>Rating</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {accommodations
                      .filter((accommodation) => accommodation.festival === festival.id)
                      .map((accommodation) => (
                        <AccommodationCard key={accommodation.id} accommodation={accommodation} />
                      ))}
                  </div>
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>

        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Need Help with Accommodation?</h2>
          <p className="text-lg text-gray-700 mb-6 max-w-2xl mx-auto">
            Our team can help you find the perfect accommodation for your festival stay, including group bookings and
            special requests.
          </p>
          <Button className="bg-green-600 hover:bg-green-700 text-white">Contact Accommodation Team</Button>
        </div>
      </div>
    </div>
  )
}

function AccommodationCard({ accommodation }) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="grid grid-cols-1 md:grid-cols-3">
        <div className="md:col-span-1">
          <img
            src={accommodation.image || "/placeholder.svg"}
            alt={accommodation.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="md:col-span-2 p-6">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xl font-bold text-green-700 mb-1">{accommodation.name}</h3>
              <p className="text-gray-600 mb-1">{accommodation.type}</p>
            </div>
            <div className="flex items-center bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
              {accommodation.special}
            </div>
          </div>

          <div className="flex items-center mt-2 mb-3">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${i < Math.floor(accommodation.rating) ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}`}
                />
              ))}
            </div>
            <span className="ml-2 text-sm text-gray-600">
              {accommodation.rating} ({accommodation.reviews} reviews)
            </span>
          </div>

          <div className="flex items-center text-gray-600 mb-3">
            <MapPin className="h-4 w-4 mr-2" />
            <span>
              {accommodation.location} • {accommodation.distance}
            </span>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {accommodation.amenities.map((amenity, index) => (
              <AmenityBadge key={index} amenity={amenity} />
            ))}
          </div>

          <div className="flex justify-between items-center mt-4">
            <div className="text-xl font-bold text-green-700">{accommodation.price}</div>
            <div className="flex gap-3">
              <Button variant="outline" className="border-green-600 text-green-600 hover:bg-green-50">
                View Details
              </Button>
              <Button className="bg-yellow-500 hover:bg-yellow-600 text-black">Book Now</Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}

function AmenityBadge({ amenity }) {
  const getIcon = (amenity) => {
    switch (amenity) {
      case "Free WiFi":
        return <Wifi className="h-3 w-3 mr-1" />
      case "Parking":
        return <Car className="h-3 w-3 mr-1" />
      case "Breakfast Included":
        return <Coffee className="h-3 w-3 mr-1" />
      default:
        return null
    }
  }

  return (
    <span className="inline-flex items-center bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs">
      {getIcon(amenity)}
      {amenity}
    </span>
  )
}

function FilterCheckbox({ id, label }) {
  return (
    <div className="flex items-center">
      <input type="checkbox" id={id} className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500" />
      <label htmlFor={id} className="ml-2 text-sm text-gray-700">
        {label}
      </label>
    </div>
  )
}
