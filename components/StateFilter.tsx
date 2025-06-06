'use client'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, MapPin, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

interface StateFilterProps {
  selectedState: string
  onChange: (value: string) => void
  isLoading?: boolean
  error?: string | null
}

export function StateFilter({ selectedState, onChange, isLoading = false, error = null }: StateFilterProps) {
  const [isOpen, setIsOpen] = useState(false)
  const states = [
    { value: 'all', label: 'All States' },
    { value: 'NSW', label: 'New South Wales' },
    { value: 'VIC', label: 'Victoria' },
    { value: 'QLD', label: 'Queensland' },
    { value: 'WA', label: 'Western Australia' },
    { value: 'SA', label: 'South Australia' },
    { value: 'TAS', label: 'Tasmania' },
    { value: 'ACT', label: 'Australian Capital Territory' },
    { value: 'NT', label: 'Northern Territory' },
  ]

  const handleRetry = () => {
    window.location.reload()
  }

  return (
    <div className="mb-6 sm:mb-8">
      <Select value={selectedState} onValueChange={onChange} disabled={isLoading}>
        <SelectTrigger className="w-full sm:w-64 bg-white/80 border-primary/30 shadow-lg rounded-xl text-base font-semibold transition-all focus:ring-2 focus:ring-primary focus:border-primary">
          <SelectValue placeholder={isLoading ? "Detecting your location..." : "Filter by State"} />
        </SelectTrigger>
        <SelectContent>
          {states.map((state) => (
            <SelectItem key={state.value} value={state.value}>
              {state.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && (
        <Alert className="mt-2 border-primary/30 bg-primary/5">
          <AlertCircle className="h-4 w-4 text-primary" />
          <AlertDescription className="text-sm text-primary">
            {error === 'Please enable location access to see content from your state' ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-xs">Location access is required to show content automatically from your state.</p>
                  <Collapsible open={isOpen} onOpenChange={setIsOpen}>
                    <CollapsibleTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="h-7 px-2 border-primary text-primary hover:bg-primary/10 flex items-center gap-1"
                      >
                        <span className="text-xs">Show instructions</span>
                        <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="mt-2">
                      <div className="text-xs space-y-2 bg-primary/10 p-2 rounded-md">
                        <p className="font-semibold">To enable location access:</p>
                        <ul className="list-disc pl-4 space-y-1">
                          <li>On iOS: Settings → Safari → Location Services → Allow</li>
                          <li>On Android: Settings → Location → App permissions → Browser → Allow</li>
                          <li>On Desktop: Click the lock/info icon in the address bar → Location → Allow</li>
                        </ul>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full border-primary text-primary hover:bg-primary/10"
                          onClick={handleRetry}
                        >
                          <MapPin className="h-4 w-4 mr-2" />
                          Retry Location Access
                        </Button>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                </div>
              </div>
            ) : (
              error
            )}
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
} 