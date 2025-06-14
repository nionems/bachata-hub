'use client'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface StateFilterProps {
  selectedState: string;
  onChange: (value: string) => void;
  className?: string;
}

export function StateFilter({ selectedState, onChange, className = '' }: StateFilterProps) {
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

  return (
    <div className={`mb-8 ${className}`}>
      <label htmlFor="state-filter" className="block text-sm font-medium text-gray-700 mb-2">
        Filter by State
      </label>
      <Select value={selectedState} onValueChange={onChange}>
        <SelectTrigger className="w-full md:w-64">
          <SelectValue placeholder="Select a state" />
        </SelectTrigger>
        <SelectContent>
          {states.map(state => (
            <SelectItem key={state.value} value={state.value}>
              {state.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
} 