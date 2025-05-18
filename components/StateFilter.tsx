'use client'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"

interface StateFilterProps {
  selectedState: string
  onChange: (value: string) => void
  isLoading?: boolean
  error?: string | null
}

export function StateFilter({ selectedState, onChange, isLoading = false, error = null }: StateFilterProps) {
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
        <Alert variant="destructive" className="mt-2">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-sm">
            {error === 'Please enable location access to see content from your state' ? (
              <div className="space-y-2">
                <p>Location access is required to show content from your state.</p>
                <div className="text-xs space-y-1">
                  <p className="font-semibold">To enable location access:</p>
                  <ul className="list-disc pl-4 space-y-1">
                    <li>On iOS: Settings → Safari → Location Services → Allow</li>
                    <li>On Android: Settings → Location → App permissions → Browser → Allow</li>
                    <li>On Desktop: Click the lock/info icon in the address bar → Location → Allow</li>
                  </ul>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-2"
                  onClick={handleRetry}
                >
                  <MapPin className="h-4 w-4 mr-2" />
                  Retry Location Access
                </Button>
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