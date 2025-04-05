import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Star, ShoppingCart, ChevronDown } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import CollapsibleFilter from "@/components/collapsible-filter"
import { applyFilters } from "../actions"

interface Product {
  id: number;
  name: string;
  price: string;
  rating: number;
  reviews: number;
  image: string;
  category: string;
  description: string;
  location: string;
  website: string;
  bestseller: boolean;
}

interface FilterCheckboxProps {
  id: string;
  label: string;
}

export default function ShopPage() {
  const products = [
    // Dance Shoes
    {
      id: 1,
      name: "Dance sneakers australia",
      price: "Various Prices",
      rating: 4.8,
      reviews: 124,
      image: "/images/bailaz.webp",
      category: "shoes",
      description:
        "Offers a wide range of dance shoes and dancewear suitable for various styles, including Salsa and Latin dances like Bachata.",
      location: "Sydney, NSW",
      website: "dance-sneakers.com.au",
      bestseller: true,
    },
    {
      id: 2,
      name: "Vivaz",
      price: "Various Prices",
      rating: 4.7,
      reviews: 98,
      image: "/images/vivaz.webp",
      category: "shoes",
      description:
        "Specializes in comfortable and stylish dance shoes for men and women, suitable for Bachata and other Latin dances.",
      location: "Gold Coast, QLD",
      website: "vivazdance.com.au",
      bestseller: true,
    },
    // More products...
    {
      id: 3,
      name: "GlamourDance Australia",
      price: "Various Prices",
      rating: 4.6,
      reviews: 87,
      image: "images/glamordance.jpg",
      category: "shoes",
      description:
        "Offers a variety of dance shoes, dancewear, and accessories, supporting the dance community across Australia and New Zealand.",
      location: "Australia-wide (Online)",
      website: "glamourdance.com",
      bestseller: false,
    },
    // More products...
  ]

  return (
    <div className="container mx-auto py-6 sm:py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-yellow-500 bg-clip-text text-transparent mb-2">Bachata Shop</h1>
          <p className="text-xl text-gray-600">
            Find Bachata dance shoes and clothing
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-6 sm:gap-8 mb-8 sm:mb-12">
          <div className="md:w-1/4">
            <CollapsibleFilter title="Filters" applyFilters={applyFilters}>
              <div className="space-y-5">
                <div>
                  <h3 className="font-medium mb-2 text-sm sm:text-base">Categories</h3>
                  <div className="space-y-1 sm:space-y-2">
                    <FilterCheckbox id="shoes" label="Dance Shoes" />
                    <FilterCheckbox id="clothing" label="Clothing" />
                    <FilterCheckbox id="music" label="Music" />
                    <FilterCheckbox id="accessories" label="Accessories" />
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-2 text-sm sm:text-base">Location</h3>
                  <div className="space-y-1 sm:space-y-2">
                    <FilterCheckbox id="sydney" label="Sydney" />
                    <FilterCheckbox id="melbourne" label="Melbourne" />
                    <FilterCheckbox id="goldcoast" label="Gold Coast" />
                    <FilterCheckbox id="online" label="Online Only" />
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-2 text-sm sm:text-base">Rating</h3>
                  <div className="space-y-1 sm:space-y-2">
                    <FilterCheckbox id="4stars" label="4 Stars & Above" />
                    <FilterCheckbox id="3stars" label="3 Stars & Above" />
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-2 text-sm sm:text-base">Special</h3>
                  <div className="space-y-1 sm:space-y-2">
                    <FilterCheckbox id="bestsellers" label="Bestsellers" />
                    <FilterCheckbox id="new" label="New Arrivals" />
                    <FilterCheckbox id="sale" label="On Sale" />
                  </div>
                </div>
              </div>
            </CollapsibleFilter>
          </div>

          <div className="md:w-3/4">
            <div className="flex justify-between items-center mb-4 sm:mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Shops</h2>
              <div className="flex items-center">
                <span className="text-gray-600 mr-2 text-xs sm:text-sm">Sort by:</span>
                <div className="relative">
                  <select className="appearance-none bg-white border border-gray-300 rounded-md py-1 sm:py-2 pl-2 sm:pl-3 pr-8 sm:pr-10 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500">
                    <option>Popularity</option>
                    <option>Rating: High to Low</option>
                    <option>Name: A to Z</option>
                    <option>Location</option>
                  </select>
                  <ChevronDown className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 h-3 w-3 sm:h-4 sm:w-4 text-gray-500" />
                </div>
              </div>
            </div>

            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid w-full grid-cols-4 mb-6 sm:mb-8">
                <TabsTrigger value="all" className="text-xs sm:text-sm">
                  All
                </TabsTrigger>
                <TabsTrigger value="shoes" className="text-xs sm:text-sm">
                  Shoes
                </TabsTrigger>
                <TabsTrigger value="clothing" className="text-xs sm:text-sm">
                  Clothing
                </TabsTrigger>
                <TabsTrigger value="music" className="text-xs sm:text-sm">
                  Music
                </TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="w-full">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </TabsContent>

              {["shoes", "clothing", "music"].map((category) => (
                <TabsContent key={category} value={category} className="w-full">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {products
                      .filter((product) => product.category === category)
                      .map((product) => (
                        <ProductCard key={product.id} product={product} />
                      ))}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-600 to-yellow-500 rounded-lg p-4 sm:p-8 text-white text-center">
          <h2 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-4">Own a Bachata-Related Shop?</h2>
          <p className="text-sm sm:text-lg mb-4 sm:mb-6 max-w-2xl mx-auto">
            List your shop on Bachata Australia to reach dancers across the country.
          </p>
          <Button size="sm" className="bg-white text-green-700 hover:bg-gray-100 text-xs sm:text-sm sm:h-10">
            Add Your Shop
          </Button>
        </div>
      </div>
    </div>
  )
}

function ProductCard({ product }: { product: Product }) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full flex flex-col">
      <div className="relative">
        {product.bestseller && (
          <div className="absolute top-2 left-2 bg-yellow-500 text-black text-xs font-bold px-2 py-1 rounded-full">
            Bestseller
          </div>
        )}
        <img
          src={product.image || "/placeholder.svg"}
          alt={product.name}
          className="w-full h-48 sm:h-64 object-cover"
        />
      </div>
      <CardHeader className="p-3 sm:p-4">
        <CardTitle className="text-base sm:text-lg text-gray-900">{product.name}</CardTitle>
        <CardDescription className="text-xs sm:text-sm text-gray-600">{product.location}</CardDescription>
      </CardHeader>
      <CardContent className="p-3 sm:p-4 pt-0 flex-grow">
        <div className="flex items-center mb-2 sm:mb-3">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-3 w-3 sm:h-4 sm:w-4 ${i < Math.floor(product.rating) ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}`}
              />
            ))}
          </div>
          <span className="ml-1 sm:ml-2 text-xs sm:text-sm text-gray-600">
            {product.rating} ({product.reviews} reviews)
          </span>
        </div>
        <p className="text-gray-700 text-xs sm:text-sm mb-2 sm:mb-3 line-clamp-3">{product.description}</p>
      </CardContent>
      <CardFooter className="border-t pt-3 p-3 sm:pt-4 sm:p-4">
        <div className="w-full flex flex-col gap-2 sm:gap-3">
          <a href={`https://${product.website}`} target="_blank" rel="noopener noreferrer" className="w-full">
            <Button size="sm" className="w-full bg-yellow-500 hover:bg-yellow-600 text-black text-xs sm:text-sm">
              Visit Website
            </Button>
          </a>
          <Link href={`/shop/products/${product.id}`} className="w-full">
            <Button
              size="sm"
              variant="outline"
              className="w-full border-green-600 text-green-600 hover:bg-green-50 text-xs sm:text-sm"
            >
              <ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              View Details
            </Button>
          </Link>
        </div>
      </CardFooter>
    </Card>
  )
}

function FilterCheckbox({ id, label }: FilterCheckboxProps) {
  return (
    <div className="flex items-center">
      <input
        type="checkbox"
        id={id}
        name={id}
        className="h-3 w-3 sm:h-4 sm:w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
      />
      <label htmlFor={id} className="ml-2 text-xs sm:text-sm text-gray-700">
        {label}
      </label>
    </div>
  )
}
