"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useState, FormEvent } from 'react'
import { toast } from "sonner"

interface ContactUsModalProps {
  isOpen: boolean
  onClose: () => void
}

interface ContactFormData {
  name: string
  email: string
  message: string
}

export function ContactUsModal({ isOpen, onClose }: ContactUsModalProps) {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/submit-form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'contact_form',
          data: formData
        }),
      })

      let data;
      try {
        data = await response.json();
      } catch (e) {
        console.error('Failed to parse response:', e);
        throw new Error('Failed to parse server response');
      }

      if (!response.ok) {
        throw new Error(data.details || data.error || 'Failed to send message')
      }

      toast.success('Message sent successfully!')
      setFormData({ name: '', email: '', message: '' })
      onClose()
    } catch (error) {
      console.error('Form submission error:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to send message. Please try again.'
      toast.error(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] bg-gradient-to-br from-primary/10 to-secondary/10">
        <DialogHeader>
          <DialogTitle className="text-primary">Contact Us</DialogTitle>
          <DialogDescription>
            Have a question or feedback? Send us a message!
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-primary">Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="bg-white/80 backdrop-blur-sm"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-primary">Email Address *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              className="bg-white/80 backdrop-blur-sm"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message" className="text-primary">Message *</Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              required
              className="min-h-[150px] bg-white/80 backdrop-blur-sm"
              placeholder="Tell us about your question or feedback..."
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              className="border-primary text-primary hover:bg-primary/10"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-primary hover:bg-primary/90"
            >
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
} 