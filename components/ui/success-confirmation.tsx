"use client"

import { useState, useEffect } from 'react'
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { CheckCircle, PartyPopper, Sparkles } from "lucide-react"
import { cn } from "@/lib/cn"

interface SuccessConfirmationProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  message?: string
  subtitle?: string
  type?: 'default' | 'festival' | 'competition' | 'event' | 'instructor' | 'dj' | 'shop' | 'school' | 'media'
  autoClose?: boolean
  autoCloseDelay?: number
}

export function SuccessConfirmation({
  isOpen,
  onClose,
  title = "Thank You! 🎉",
  message = "Your submission has been sent successfully and is awaiting approval.",
  subtitle = "We'll review your submission and get back to you soon!",
  type = 'default',
  autoClose = true,
  autoCloseDelay = 5000
}: SuccessConfirmationProps) {
  const [showSparkles, setShowSparkles] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setShowSparkles(true)
      // Auto-close after delay
      if (autoClose) {
        const timer = setTimeout(() => {
          onClose()
        }, autoCloseDelay)
        return () => clearTimeout(timer)
      }
    } else {
      setShowSparkles(false)
    }
  }, [isOpen, autoClose, autoCloseDelay, onClose])

  const getTypeConfig = () => {
    switch (type) {
      case 'festival':
        return {
          icon: <PartyPopper className="w-12 h-12 text-purple-500" />,
          bgColor: 'bg-gradient-to-br from-purple-50 to-pink-50',
          borderColor: 'border-purple-200',
          iconBg: 'bg-purple-100'
        }
      case 'competition':
        return {
          icon: <CheckCircle className="w-12 h-12 text-blue-500" />,
          bgColor: 'bg-gradient-to-br from-blue-50 to-indigo-50',
          borderColor: 'border-blue-200',
          iconBg: 'bg-blue-100'
        }
      case 'event':
        return {
          icon: <CheckCircle className="w-12 h-12 text-green-500" />,
          bgColor: 'bg-gradient-to-br from-green-50 to-emerald-50',
          borderColor: 'border-green-200',
          iconBg: 'bg-green-100'
        }
      case 'instructor':
        return {
          icon: <CheckCircle className="w-12 h-12 text-orange-500" />,
          bgColor: 'bg-gradient-to-br from-orange-50 to-amber-50',
          borderColor: 'border-orange-200',
          iconBg: 'bg-orange-100'
        }
      case 'dj':
        return {
          icon: <CheckCircle className="w-12 h-12 text-red-500" />,
          bgColor: 'bg-gradient-to-br from-red-50 to-pink-50',
          borderColor: 'border-red-200',
          iconBg: 'bg-red-100'
        }
      case 'shop':
        return {
          icon: <CheckCircle className="w-12 h-12 text-teal-500" />,
          bgColor: 'bg-gradient-to-br from-teal-50 to-cyan-50',
          borderColor: 'border-teal-200',
          iconBg: 'bg-teal-100'
        }
      case 'school':
        return {
          icon: <CheckCircle className="w-12 h-12 text-indigo-500" />,
          bgColor: 'bg-gradient-to-br from-indigo-50 to-purple-50',
          borderColor: 'border-indigo-200',
          iconBg: 'bg-indigo-100'
        }
      case 'media':
        return {
          icon: <CheckCircle className="w-12 h-12 text-pink-500" />,
          bgColor: 'bg-gradient-to-br from-pink-50 to-rose-50',
          borderColor: 'border-pink-200',
          iconBg: 'bg-pink-100'
        }
      default:
        return {
          icon: <CheckCircle className="w-12 h-12 text-emerald-500" />,
          bgColor: 'bg-gradient-to-br from-emerald-50 to-green-50',
          borderColor: 'border-emerald-200',
          iconBg: 'bg-emerald-100'
        }
    }
  }

  const config = getTypeConfig()

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md p-0 overflow-hidden border-0 shadow-2xl">
        <div className={cn(
          "relative p-8 text-center",
          config.bgColor,
          config.borderColor,
          "border rounded-2xl"
        )}>
          {/* Sparkles Animation */}
          {showSparkles && (
            <>
              <Sparkles className="absolute top-4 left-4 w-4 h-4 text-yellow-400 animate-pulse" />
              <Sparkles className="absolute top-6 right-6 w-3 h-3 text-yellow-400 animate-pulse delay-300" />
              <Sparkles className="absolute bottom-6 left-6 w-3 h-3 text-yellow-400 animate-pulse delay-500" />
              <Sparkles className="absolute bottom-4 right-4 w-4 h-4 text-yellow-400 animate-pulse delay-700" />
            </>
          )}

          {/* Icon */}
          <div className={cn(
            "inline-flex items-center justify-center w-20 h-20 rounded-full mb-6",
            config.iconBg
          )}>
            {config.icon}
          </div>

          {/* Title */}
          <h3 className="text-2xl font-bold text-gray-900 mb-3">
            {title}
          </h3>

          {/* Message */}
          <p className="text-gray-700 mb-4 leading-relaxed">
            {message}
          </p>

          {/* Subtitle */}
          <p className="text-sm text-gray-500 mb-6">
            {subtitle}
          </p>

          {/* Action Button */}
          <Button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-emerald-500 to-violet-500 hover:from-emerald-600 hover:to-violet-600 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            Got it!
          </Button>

          {/* Progress bar for auto-close */}
          {autoClose && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200 rounded-b-2xl overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-emerald-500 to-violet-500 transition-all duration-300 ease-linear"
                style={{
                  width: showSparkles ? '100%' : '0%',
                  transitionDuration: `${autoCloseDelay}ms`
                }}
              />
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Hook for easy success confirmation
export function useSuccessConfirmation() {
  const [isOpen, setIsOpen] = useState(false)
  const [type, setType] = useState<'default' | 'festival' | 'competition' | 'event' | 'instructor' | 'dj' | 'shop' | 'school' | 'media'>('default')

  const showSuccess = (type: 'default' | 'festival' | 'competition' | 'event' | 'instructor' | 'dj' | 'shop' | 'school' | 'media' = 'default') => {
    setType(type)
    setIsOpen(true)
  }

  const hideSuccess = () => {
    setIsOpen(false)
  }

  return {
    isOpen,
    isSuccessVisible: isOpen,
    showSuccess,
    hideSuccess,
    onClose: hideSuccess,
    type
  }
} 