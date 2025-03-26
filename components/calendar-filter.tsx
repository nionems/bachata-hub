"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { CalendarIcon, MapPin, X } from "lucide-react"
import CollapsibleFilter from "./collapsible-filter"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

export default function CalendarFilter() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Get current filter values from URL
  const currentKeyword = searchParams.get("keyword") || ""
  const currentEventType = searchParams.get("eventType") || "all"
  const currentLocation = searchParams.get("location") || ""
  const currentStartDate = searchParams.get("startDate") || ""
  const currentEndDate = searchParams.get("endDate") || ""

  // Local state for form inputs
  const [keyword, setKeyword] = useState(currentKeyword)
  const [eventType, setEventType] = useState(currentEventType)
  const [location, setLocation] = useState(currentLocation)
  const [startDate, setStartDate] = useState<Date | undefined>(
    currentStartDate ? new Date(currentStartDate) : undefined,
  )
  const [endDate, setEndDate] = useState<Date | undefined>(currentEndDate ? new Date(currentEndDate) : undefined)

  // State for active filters count
  const [activeFiltersCount, setActiveFiltersCount] = useState(() => {
    let count = 0
    if (currentKeyword) count++
    if (currentEventType && currentEventType !== "all") count++
    if (currentLocation) count++
    if (currentStartDate) count++
    if (currentEndDate) count++
    return count
  })

  const applyFilters = () => {
    // Create a new URLSearchParams object
    const params = new URLSearchParams()

    // Add filter values to params if they exist
    if (keyword) params.set("keyword", keyword)
    if (eventType && eventType !== "all") params.set("eventType", eventType)
    if (location) params.set("location", location)
    if (startDate) params.set("startDate", startDate.toISOString().split("T")[0])
    if (endDate) params.set("endDate", endDate.toISOString().split("T")[0])

    // Count active filters
    let count = 0
    if (keyword) count++
    if (eventType && eventType !== "all") count++
    if (location) count++
    if (startDate) count++
    if (endDate) count++
    setActiveFiltersCount(count)

    // Navigate to the filtered URL
    router.push(`/calendar?${params.toString()}`)
  }

  const clearFilters = () => {
    setKeyword("")
    setEventType("all")
    setLocation("")
    setStartDate(undefined)
    setEndDate(undefined)
    setActiveFiltersCount(0)
    router.push("/calendar")
  }

  return (
    <CollapsibleFilter
      title={`Filter Events ${activeFiltersCount > 0 ? `(${activeFiltersCount})` : ""}`}
      showApplyButton={false}
    >
      <div className="space-y-6">
        {/* Keyword search */}
        <div className="space-y-2">
          <Label htmlFor="keyword">Search</Label>
          <div className="relative">
            <Input
              id="keyword"
              placeholder="Search events..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="pr-8"
            />
            {keyword && (
              <button
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                onClick={() => setKeyword("")}
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* Event Type */}
        <div className="space-y-2">
          <Label>Event Type</Label>
          <RadioGroup value={eventType} onValueChange={setEventType}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="all" id="all" />
              <Label htmlFor="all" className="cursor-pointer">
                All Events
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="social" id="social" />
              <Label htmlFor="social" className="cursor-pointer">
                Social Dances
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="workshop" id="workshop" />
              <Label htmlFor="workshop" className="cursor-pointer">
                Workshops
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="festival" id="festival" />
              <Label htmlFor="festival" className="cursor-pointer">
                Festivals
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="class" id="class" />
              <Label htmlFor="class" className="cursor-pointer">
                Classes
              </Label>
            </div>
          </RadioGroup>
        </div>

        {/* Location */}
        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <div className="relative">
            <MapPin className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="location"
              placeholder="City or venue..."
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="pl-8 pr-8"
            />
            {location && (
              <button
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                onClick={() => setLocation("")}
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* Date Range */}
        <div className="space-y-2">
          <Label>Date Range</Label>
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="flex-1">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn("w-full justify-start text-left font-normal", !startDate && "text-muted-foreground")}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "PPP") : "Start date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus />
                </PopoverContent>
              </Popover>
            </div>
            <div className="flex-1">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn("w-full justify-start text-left font-normal", !endDate && "text-muted-foreground")}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, "PPP") : "End date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    initialFocus
                    disabled={(date) => (startDate ? date < startDate : false)}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-2 pt-4 border-t">
          <Button onClick={applyFilters} className="bg-green-600 hover:bg-green-700 text-white">
            Apply Filters
          </Button>
          <Button variant="outline" onClick={clearFilters} disabled={activeFiltersCount === 0}>
            Clear All
          </Button>
        </div>
      </div>
    </CollapsibleFilter>
  )
}
