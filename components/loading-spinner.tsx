'use client'

import React from 'react'

interface LoadingSpinnerProps {
  message?: string
  color?: 'primary' | 'red' | 'white'
  size?: 'sm' | 'md' | 'lg'
}

export function LoadingSpinner({
  message = 'Loading...',
}: LoadingSpinnerProps) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-white dark:bg-gray-900">
      <div className="flex flex-col items-center gap-4">
        <style>{`
          @keyframes logo-pulse {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.4; transform: scale(0.92); }
          }
          .logo-loading {
            animation: logo-pulse 1.6s ease-in-out infinite;
          }
        `}</style>
        <img
          src="/images/BACHATA.AU (13).png"
          alt="Loading"
          className="logo-loading w-24 h-24 rounded-2xl"
        />
        <p className="text-primary text-sm font-medium text-center animate-pulse">
          {message}
        </p>
      </div>
    </div>
  )
}
