import React from 'react'

interface LoadingSpinnerProps {
  message?: string
  color?: 'primary' | 'red' | 'white'
  size?: 'sm' | 'md' | 'lg'
}

export function LoadingSpinner({ 
  message = 'Loading...', 
  color = 'primary',
  size = 'md'
}: LoadingSpinnerProps) {
  const colorClasses = {
    primary: 'border-primary border-t-transparent text-primary',
    red: 'border-red-500 border-t-transparent text-red-500',
    white: 'border-white border-t-transparent text-white'
  }

  const sizeClasses = {
    sm: 'w-6 h-6 sm:w-8 sm:h-8 text-xs',
    md: 'w-12 h-12 sm:w-16 sm:h-16 text-sm',
    lg: 'w-16 h-16 sm:w-24 sm:h-24 text-base'
  }

  return (
    <div className="min-h-[50vh] sm:min-h-screen flex items-center justify-center p-4">
      <div className="flex flex-col items-center gap-2 sm:gap-4">
        <div className={`${sizeClasses[size]} border-2 sm:border-4 rounded-full animate-spin ${colorClasses[color]}`}></div>
        <p className={`${colorClasses[color]} text-center text-xs sm:text-sm md:text-base`}>{message}</p>
      </div>
    </div>
  )
} 