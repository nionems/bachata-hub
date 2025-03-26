"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp } from "lucide-react"

interface CollapsibleFilterProps {
  title: string
  children: React.ReactNode
  applyFilters?: (formData: FormData) => Promise<any>
  showApplyButton?: boolean
  className?: string
}

export default function CollapsibleFilter({
  title,
  children,
  applyFilters,
  showApplyButton = true,
  className,
}: CollapsibleFilterProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
      if (window.innerWidth >= 768) {
        setIsOpen(true)
      }
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)

    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const handleSubmit = async (formData: FormData) => {
    if (!applyFilters) return

    setIsSubmitting(true)
    try {
      await applyFilters(formData)
    } catch (error) {
      console.error("Error applying filters:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className={className}>
      <div 
        className="p-3 sm:p-6 cursor-pointer flex items-center justify-between" 
        onClick={() => isMobile && setIsOpen(!isOpen)}
      >
        <div className="text-base sm:text-lg font-semibold">{title}</div>
        {isMobile && (
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        )}
      </div>

      {(!isMobile || isOpen) && (
        <div className="p-3 sm:p-6">
          <form action={handleSubmit}>
            {children}

            {showApplyButton && applyFilters && (
              <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t">
                <Button
                  type="submit"
                  size="sm"
                  disabled={isSubmitting}
                  className="w-full bg-green-600 hover:bg-green-700 text-white text-xs sm:text-sm"
                >
                  {isSubmitting ? "Applying..." : "Apply Filters"}
                </Button>
              </div>
            )}
          </form>
        </div>
      )}
    </div>
  )
}
