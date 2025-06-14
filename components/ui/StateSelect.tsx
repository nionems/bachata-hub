'use client'

import React from 'react'

interface StateSelectProps {
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  className?: string;
}

const AUSTRALIAN_STATES = [
  { value: 'NSW', label: 'New South Wales' },
  { value: 'VIC', label: 'Victoria' },
  { value: 'QLD', label: 'Queensland' },
  { value: 'WA', label: 'Western Australia' },
  { value: 'SA', label: 'South Australia' },
  { value: 'TAS', label: 'Tasmania' },
  { value: 'ACT', label: 'Australian Capital Territory' },
  { value: 'NT', label: 'Northern Territory' }
]

export function StateSelect({ value, onChange, required = false, className }: StateSelectProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">State</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${className || ''}`}
        required={required}
      >
        <option value="">Select a state</option>
        {AUSTRALIAN_STATES.map((state) => (
          <option key={state.value} value={state.value}>
            {state.label}
          </option>
        ))}
      </select>
    </div>
  )
} 