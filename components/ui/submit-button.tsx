"use client"

import { Button } from "@/components/ui/button"
import { Loader2, Send, CheckCircle, ArrowRight } from "lucide-react"
import { cn } from "@/lib/cn"
import { useState } from "react"

interface SubmitButtonProps {
  isLoading?: boolean
  isSuccess?: boolean
  disabled?: boolean
  children: React.ReactNode
  className?: string
  variant?: 'default' | 'gradient' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  icon?: 'send' | 'arrow' | 'check' | 'none'
}

export function SubmitButton({
  isLoading = false,
  isSuccess = false,
  disabled = false,
  children,
  className,
  variant = 'gradient',
  size = 'md',
  icon = 'send'
}: SubmitButtonProps) {
  const getIcon = () => {
    if (isLoading) {
      return <Loader2 className="h-4 w-4 animate-spin" />
    }
    if (isSuccess) {
      return <CheckCircle className="h-4 w-4" />
    }
    switch (icon) {
      case 'send':
        return <Send className="h-4 w-4" />
      case 'arrow':
        return <ArrowRight className="h-4 w-4" />
      case 'check':
        return <CheckCircle className="h-4 w-4" />
      default:
        return null
    }
  }

  const getVariantClasses = () => {
    switch (variant) {
      case 'gradient':
        return 'bg-gradient-to-r from-emerald-500 to-violet-500 hover:from-emerald-600 hover:to-violet-600 text-white shadow-lg hover:shadow-xl'
      case 'outline':
        return 'border-2 border-emerald-500 text-emerald-600 hover:bg-emerald-50 hover:border-emerald-600'
      default:
        return 'bg-emerald-500 hover:bg-emerald-600 text-white'
    }
  }

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'h-8 px-3 text-sm'
      case 'lg':
        return 'h-12 px-6 text-lg'
      default:
        return 'h-10 px-4 text-base'
    }
  }

  return (
    <Button
      type="submit"
      disabled={disabled || isLoading}
      className={cn(
        'relative overflow-hidden transition-all duration-300 ease-in-out font-semibold rounded-lg',
        'transform hover:scale-105 active:scale-95',
        'focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2',
        getVariantClasses(),
        getSizeClasses(),
        className
      )}
    >
      {/* Animated background for gradient variant */}
      {variant === 'gradient' && (
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-violet-400 opacity-0 hover:opacity-100 transition-opacity duration-300" />
      )}
      
      {/* Content */}
      <div className="relative flex items-center justify-center gap-2">
        {getIcon()}
        <span className="transition-all duration-200">
          {isLoading ? 'Processing...' : isSuccess ? 'Success!' : children}
        </span>
      </div>
      
      {/* Success animation */}
      {isSuccess && (
        <div className="absolute inset-0 bg-green-500 rounded-lg animate-pulse" />
      )}
    </Button>
  )
}

// Hook for managing submit button states
export function useSubmitButton() {
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = async (submitFunction: () => Promise<void>) => {
    setIsLoading(true)
    setIsSuccess(false)
    
    try {
      await submitFunction()
      setIsSuccess(true)
      // Reset success state after 2 seconds
      setTimeout(() => setIsSuccess(false), 2000)
    } catch (error) {
      console.error('Submit error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return {
    isLoading,
    isSuccess,
    handleSubmit
  }
} 