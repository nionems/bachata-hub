"use client"

import { useEffect, useState } from 'react'
import { X } from 'lucide-react'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export default function InstallPrompt() {
  const [prompt, setPrompt] = useState<BeforeInstallPromptEvent | null>(null)

  useEffect(() => {
    if (
      window.matchMedia('(display-mode: standalone)').matches ||
      localStorage.getItem('installDismissed') === 'true'
    ) return

    const handler = (e: Event) => {
      e.preventDefault()
      setPrompt(e as BeforeInstallPromptEvent)
    }
    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const dismiss = () => {
    localStorage.setItem('installDismissed', 'true')
    setPrompt(null)
  }

  const install = async () => {
    if (!prompt) return
    await prompt.prompt()
    const { outcome } = await prompt.userChoice
    if (outcome === 'accepted') dismiss()
    else setPrompt(null)
  }

  if (!prompt) return null

  return (
    <div className="fixed bottom-20 left-4 right-4 z-50 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 p-4 flex items-center gap-3">
      <img src="/images/BACHATA.AU (13).png" alt="Bachata Hub" className="h-12 w-12 rounded-xl flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-gray-900 dark:text-gray-100 text-sm">Add to Home Screen</p>
        <p className="text-xs text-gray-500 dark:text-gray-400">Use Bachata Hub like an app</p>
      </div>
      <button
        onClick={install}
        className="flex-shrink-0 bg-green-500 hover:bg-green-600 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors"
      >
        Add
      </button>
      <button onClick={dismiss} className="flex-shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
        <X className="h-5 w-5" />
      </button>
    </div>
  )
}
