"use client"

import { useState } from 'react'
import { Check, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

// Dance styles from constants
const DANCE_STYLES = [
  'All Dance Styles',
  'Bachata',
  'Salsa', 
  'Kizomba',
  'Zouk',
  'Reaggeaton',
  'Heels',
  'Pole Dance',
  'Latin Beat'
]

interface DanceStyleFilterProps {
  selectedDanceStyle: string
  onDanceStyleChange: (danceStyle: string) => void
}

export function DanceStyleFilter({ selectedDanceStyle, onDanceStyleChange }: DanceStyleFilterProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="w-full sm:w-[200px] justify-between bg-white border-gray-200 focus:border-primary focus:ring-primary rounded-md"
        >
          <span className="truncate">
            {selectedDanceStyle}
          </span>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-full sm:w-[200px]" align="start">
        {DANCE_STYLES.map((style) => (
          <DropdownMenuItem
            key={style}
            onClick={() => {
              onDanceStyleChange(style)
              setIsOpen(false)
            }}
            className="flex items-center justify-between cursor-pointer"
          >
            <span>{style}</span>
            {selectedDanceStyle === style && (
              <Check className="h-4 w-4 text-primary" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
} 