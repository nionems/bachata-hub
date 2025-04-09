'use client'

interface StateFilterProps {
  selectedState: string;
  onChange: (state: string) => void;
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
      <select
        id="state-filter"
        value={selectedState}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 block w-full md:w-64 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
      >
        {states.map(state => (
          <option key={state.value} value={state.value}>
            {state.label}
          </option>
        ))}
      </select>
    </div>
  )
} 