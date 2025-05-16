'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Phone, Mail, Globe } from "lucide-react"

interface ItemType {
  id: string
  name: string
  location: string
  state: string
  description: string
  website?: string
  contactInfo?: string
  email?: string
  imageUrl?: string
  googleMapLink?: string
  comment?: string
}

export default function PageName() {
  const [items, setItems] = useState<ItemType[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const params = useParams()
  const pageType = params.page as string

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch(`/api/${pageType}`)
        if (!response.ok) throw new Error('Failed to fetch items')
        const data = await response.json()
        setItems(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setIsLoading(false)
      }
    }

    fetchItems()
  }, [pageType])

  if (isLoading) return <div className="p-4">Loading...</div>
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">
          {pageType.charAt(0).toUpperCase() + pageType.slice(1)}
        </h1>
        <p className="text-base sm:text-xl text-gray-600">
          Find the best {pageType} across Australia
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {items.map((item) => (
          <Card key={item.id} className="overflow-hidden">
            {item.imageUrl && (
              <div className="relative aspect-video">
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <CardHeader>
              <CardTitle>{item.name}</CardTitle>
              <CardDescription className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>{item.location}, {item.state}</span>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-gray-600">{item.description}</p>
                {item.contactInfo && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    <span>{item.contactInfo}</span>
                  </div>
                )}
                {item.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    <span>{item.email}</span>
                  </div>
                )}
                {item.website && (
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    <a 
                      href={item.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      Website
                    </a>
                  </div>
                )}
                {item.comment && (
                  <p className="text-sm text-gray-600 mt-2">{item.comment}</p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
