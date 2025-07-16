export const AUSTRALIAN_STATES = [
  { value: 'NSW', label: 'New South Wales' },
  { value: 'VIC', label: 'Victoria' },
  { value: 'QLD', label: 'Queensland' },
  { value: 'WA', label: 'Western Australia' },
  { value: 'SA', label: 'South Australia' },
  { value: 'TAS', label: 'Tasmania' },
  { value: 'ACT', label: 'Australian Capital Territory' },
  { value: 'NT', label: 'Northern Territory' }
] as const 

// Dance Styles Constants
export const DANCE_STYLES = [
  'Bachata',
  'Salsa', 
  'Kizomba',
  'Zouk',
  'Reggaeton',
  'Heels',
  'Pole Dance',
  'Latin Beat',
  'HipHop',
  'Mambo',
  'Dominican Bachata',
  'Sensual Bachata',
  'Bachata Moderna',
  'Cuban Salsa',
  'Chacha',
  'Rumba',
  'Merengue',
  'Tango',
  'Afrobeats',
  'Taraxo',
  'Choreography',
  'Other'
] as const

export type DanceStyle = typeof DANCE_STYLES[number] 