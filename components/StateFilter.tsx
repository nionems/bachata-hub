'use client'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface StateFilterProps {
  selectedState: string
  onChange: (value: string) => void
}

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

export function StateFilter({ selectedState, onChange }: StateFilterProps) {
  return (
    <div className="mb-6 sm:mb-8">
      <Select value={selectedState} onValueChange={onChange}>
        <SelectTrigger className="w-full sm:w-64">
          <SelectValue placeholder="Filter by State" />
        </SelectTrigger>
        <SelectContent>
          {states.map((state) => (
            <SelectItem key={state.value} value={state.value}>
              {state.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
} 