'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { X, Smartphone, Download, Apple } from "lucide-react"

export function AddToHomeScreenModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [hasSeenModal, setHasSeenModal] = useState(false)

  useEffect(() => {
    // Only show on desktop and if user hasn't seen it before
    const isDesktop = window.innerWidth >= 768
    const hasSeen = localStorage.getItem('addToHomeScreenModalSeen')
    
    console.log('AddToHomeScreenModal debug:', { isDesktop, hasSeen, hasSeenModal })
    
    if (isDesktop && !hasSeen && !hasSeenModal) {
      // Delay the modal to show after page load
      const timer = setTimeout(() => {
        console.log('Showing AddToHomeScreenModal')
        setIsOpen(true)
        setHasSeenModal(true)
        localStorage.setItem('addToHomeScreenModalSeen', 'true')
      }, 3000) // Show after 3 seconds

      return () => clearTimeout(timer)
    }
  }, [hasSeenModal])

  // Only show button on desktop, but allow modal to work on all devices
  const isDesktop = typeof window !== 'undefined' ? window.innerWidth >= 768 : true

  const handleClose = () => {
    setIsOpen(false)
  }

  const getInstructions = () => {
    const userAgent = navigator.userAgent.toLowerCase()
    
    if (userAgent.includes('safari') && !userAgent.includes('chrome')) {
      return {
        title: "Add to HomeScreen (iPhone)",
        steps: [
          "Go to https://bachata.au",
          "Tap the Share icon",
          "Scroll down and tap 'Add to HomeScreen'"
        ]
      }
    } else if (userAgent.includes('android')) {
      return {
        title: "Add to HomeScreen (Android)",
        steps: [
          "Open Chrome and go to https://bachata.au",
          "Tap the three dots menu (top right corner)",
          "Select 'Add to Homescreen'"
        ]
      }
    } else {
      return {
        title: "Add to Home Screen",
        steps: [
          { type: 'icon', icon: 'apple', text: 'iPhone' },
          "Go to https://bachata.au",
          "Tap the Share icon",
          "Scroll down & tap 'Add to Home Screen'",
          "✅ Bachata.au work like an App",
          { type: 'icon', icon: 'android', text: 'Android' },
          "Go to https://bachata.au",
          "Tap the three dots menu",
          "Select 'Add to Homescreen'",
          "✅ Bachata.au work like an App"
        ]
      }
    }
  }

  const instructions = getInstructions()

  // Temporary test button - remove this later
  const showModalForTesting = () => {
    console.log('Button clicked! Setting modal to open')
    localStorage.removeItem('addToHomeScreenModalSeen')
    setIsOpen(true)
    console.log('Modal state:', isOpen)
  }

  if (!isOpen) {
    console.log('Rendering button, isOpen:', isOpen)
    return (
      <div className="fixed left-1/2 top-6 transform -translate-x-1/2 md:left-auto md:right-4 md:top-6 md:transform-none z-50">
        <Button onClick={showModalForTesting} size="sm" className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white shadow-lg">
          Add to homescreen
        </Button>
      </div>
    )
  }

  return (
    <div className="fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-sm md:right-4 md:top-16 md:w-96 md:max-h-[calc(100vh-6rem)] md:transform-none bg-white border-2 border-primary/20 rounded-xl shadow-2xl overflow-y-auto z-50 p-4">
      <div className="relative pb-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleClose}
          className="absolute right-0 top-0 h-6 w-6 p-0 hover:bg-primary/10"
        >
          <X className="h-4 w-4" />
        </Button>
        <div className="flex items-center gap-2 text-lg font-bold text-primary pr-8">
          <Smartphone className="h-5 w-5" />
          Add to HomeScreen
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="text-sm text-gray-600">
          <p className="mb-3">
            Get quick access to Bachata Hub by adding it to your mobile home screen!
          </p>
          
                      <div className="space-y-2">
              {instructions.steps.map((step, index) => {
                if (typeof step === 'object' && 'type' in step && step.type === 'icon') {
                  return (
                    <div key={index} className="flex items-center gap-2 mt-3">
                      {step.icon === 'apple' ? (
                        <Apple className="h-5 w-5 text-gray-800" />
                      ) : (
                        <svg className="h-5 w-5 text-gray-800" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M17.523 15.3414c-.5511 0-.9999-.4486-.9999-.9997s.4488-.9997.9999-.9997c.5511 0 .9999.4486.9999.9997s-.4488.9997-.9999.9997m-5.01 0c-.5511 0-.9999-.4486-.9999-.9997s.4488-.9997.9999-.9997c.5511 0 .9999.4486.9999.9997s-.4488.9997-.9999.9997m-5.01 0c-.5511 0-.9999-.4486-.9999-.9997s.4488-.9997.9999-.9997c.5511 0 .9999.4486.9999.9997s-.4488.9997-.9999.9997m5.01-5.01c-.5511 0-.9999-.4486-.9999-.9997s.4488-.9997.9999-.9997c.5511 0 .9999.4486.9999.9997s-.4488.9997-.9999.9997m-5.01 0c-.5511 0-.9999-.4486-.9999-.9997s.4488-.9997.9999-.9997c.5511 0 .9999.4486.9999.9997s-.4488.9997-.9999.9997m5.01-5.01c-.5511 0-.9999-.4486-.9999-.9997s.4488-.9997.9999-.9997c.5511 0 .9999.4486.9999.9997s-.4488.9997-.9999.9997m-5.01 0c-.5511 0-.9999-.4486-.9999-.9997s.4488-.9997.9999-.9997c.5511 0 .9999.4486.9999.9997s-.4488.9997-.9999.9997"/>
                        </svg>
                      )}
                      <p className="text-sm font-semibold text-gray-800">{step.text}</p>
                    </div>
                  )
                }
                
                // Calculate step number based on platform
                let stepNumber = 1
                let currentPlatform = 'ios'
                
                for (let i = 0; i < index; i++) {
                  const prevStep = instructions.steps[i]
                  if (typeof prevStep === 'object' && 'type' in prevStep && prevStep.type === 'icon') {
                    if (prevStep.icon === 'android') {
                      currentPlatform = 'android'
                      stepNumber = 1
                    } else {
                      currentPlatform = 'ios'
                      stepNumber = 1
                    }
                  } else {
                    stepNumber++
                  }
                }
                
                return (
                  <div key={index} className="flex items-start gap-2">
                    <div className="flex-shrink-0 w-5 h-5 bg-primary text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
                      {stepNumber}
                    </div>
                    <p className="text-sm">{step as string}</p>
                  </div>
                )
              })}
            </div>
        </div>

        <div className="flex items-center gap-2 p-3 bg-primary/10 rounded-lg">
          <Download className="h-4 w-4 text-primary" />
          <span className="text-sm text-primary font-medium">
            This will create a native app-like experience on your mobile device
          </span>
        </div>

        <div className="flex justify-end">
          <Button onClick={handleClose} className="bg-primary hover:bg-primary/90">
            Got it!
          </Button>
        </div>
      </div>
    </div>
  )
} 