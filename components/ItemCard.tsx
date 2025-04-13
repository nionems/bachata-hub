import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin } from "lucide-react"

interface Item {
  id: string
  name: string
  location: string
  state: string
  imageUrl?: string
  description?: string
  comment?: string
}

interface ItemCardProps {
  item: Item
}

export function ItemCard({ item }: ItemCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="h-48 overflow-hidden">
        <img
          src={item.imageUrl || '/placeholder.svg'}
          alt={item.name}
          className="w-full h-full object-cover transition-transform hover:scale-105"
        />
      </div>
      <CardHeader className="p-3">
        <CardTitle className="text-base text-primary">{item.name}</CardTitle>
        <CardDescription className="flex items-center gap-2 text-xs">
          <MapPin className="h-3 w-3" />
          {item.location}, {item.state}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-3 pt-0">
        {item.description && (
          <p className="text-gray-600 text-xs line-clamp-2">{item.description}</p>
        )}
        {item.comment && (
          <p className="text-gray-600 text-xs mt-1">{item.comment}</p>
        )}
      </CardContent>
    </Card>
  )
} 