"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { X } from "lucide-react"

interface ImageModalProps {
  isOpen: boolean
  onClose: () => void
  imageUrl: string
  title: string
}

export function ImageModal({ isOpen, onClose, imageUrl, title }: ImageModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl p-0 bg-transparent border-none">
        <DialogHeader>
          <DialogTitle className="sr-only">{title}</DialogTitle>
        </DialogHeader>
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-50 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/50"
          aria-label="Close image"
        >
          <X className="h-6 w-6 sm:h-8 sm:w-8" />
        </button>
        <div className="relative w-full h-[80vh] sm:h-[85vh]">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
} 