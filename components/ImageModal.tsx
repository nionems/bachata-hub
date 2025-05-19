import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { X } from "lucide-react"
import Image from "next/image"

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
        <button
          onClick={onClose}
          className="absolute right-6 top-6 z-50 bg-primary hover:bg-primary/90 text-white rounded-full p-4 shadow-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/50"
          aria-label="Close image"
        >
          <X className="h-10 w-10" />
        </button>
        <div className="relative w-full h-[80vh] sm:h-[85vh]">
          <Image
            src={imageUrl}
            alt={title}
            width={1200}
            height={800}
            className="w-full h-full object-contain"
            priority
          />
        </div>
      </DialogContent>
    </Dialog>
  )
} 
 