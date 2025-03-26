"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Filter, ChevronDown, ChevronUp } from "lucide-react"

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
    <Card className={className}>
      <CardHeader className="p-3 sm:p-6 cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base sm:text-lg flex items-center">
            <Filter className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2" />
            {title}
          </CardTitle>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>
      </CardHeader>

      {isOpen && (
        <CardContent className="p-3 sm:p-6 pt-0 border-t">
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
        </CardContent>
      )}
    </Card>
  )
}
