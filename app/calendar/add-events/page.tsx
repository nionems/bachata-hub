"use client"

import { useState } from "react"
import { EventSubmissionForm } from "@/components/EventSubmissionForm"

export default function AddEventPage() {
  const [isFormOpen, setIsFormOpen] = useState(true)

  return (
    <div className="container mx-auto py-6 sm:py-12 px-4">
      <EventSubmissionForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
      />
    </div>
  )
}
