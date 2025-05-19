'use client'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, MapPin, ChevronDown, Info } from "lucide-react"
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

  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent)

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
        <div className="mb-4">
          <Alert variant="default" className="bg-green-50 text-primary border-green-200">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <Info className="h-4 w-4" />
                <span className="font-medium">Location Access Required</span>
              </div>
              <p className="text-sm text-primary/80">
                {error}
              </p>
              <Button
                variant="outline"
                size="sm"
                className="w-full mt-2 border-green-200 hover:bg-green-100 hover:text-primary"
                onClick={() => setIsOpen(!isOpen)}
              >
                <div className="flex items-center justify-center gap-2">
                  <span>Show instructions</span>
                  <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                </div>
              </Button>
              <Collapsible open={isOpen}>
                <div className="mt-2 text-sm text-primary/80 space-y-2">
                  <p>To enable location access:</p>
                  {isSafari ? (
                    <>
                      <p>1. Click "Allow" in the system prompt that appears</p>
                      <p>2. If you don't see the prompt, click the lock icon in your browser's address bar</p>
                      <p>3. Select "Allow" for location access</p>
                    </>
                  ) : (
                    <>
                      <p>1. Click "Allow" in the browser prompt</p>
                      <p>2. If you don't see the prompt, click the lock icon in your browser's address bar</p>
                      <p>3. Enable location access for this site</p>
                    </>
                  )}
                </div>
              </Collapsible>
            </div>
          </Alert>
        </div>
      )}
    </div>
  )
} 