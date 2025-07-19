"use client"

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Trash2, CheckCircle, XCircle, Info } from "lucide-react"

interface ConfirmationDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  description: string
  type?: 'delete' | 'approve' | 'reject' | 'info'
  confirmText?: string
  cancelText?: string
  isLoading?: boolean
}

export function ConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  type = 'delete',
  confirmText,
  cancelText = 'Cancel',
  isLoading = false
}: ConfirmationDialogProps) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) return null

  const getIcon = () => {
    switch (type) {
      case 'delete':
        return <Trash2 className="h-6 w-6 text-red-500" />
      case 'approve':
        return <CheckCircle className="h-6 w-6 text-green-500" />
      case 'reject':
        return <XCircle className="h-6 w-6 text-red-500" />
      case 'info':
        return <Info className="h-6 w-6 text-blue-500" />
      default:
        return <AlertTriangle className="h-6 w-6 text-yellow-500" />
    }
  }

  const getConfirmButtonVariant = () => {
    switch (type) {
      case 'delete':
        return 'destructive'
      case 'approve':
        return 'default'
      case 'reject':
        return 'destructive'
      case 'info':
        return 'default'
      default:
        return 'default'
    }
  }

  const getDefaultConfirmText = () => {
    switch (type) {
      case 'delete':
        return 'Delete'
      case 'approve':
        return 'Approve'
      case 'reject':
        return 'Reject'
      case 'info':
        return 'Confirm'
      default:
        return 'Confirm'
    }
  }

  const handleConfirm = () => {
    onConfirm()
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-white rounded-xl shadow-xl border-0">
        <DialogHeader className="text-center">
          <div className="flex justify-center mb-4">
            {getIcon()}
          </div>
          <DialogTitle className="text-lg font-semibold text-gray-900">
            {title}
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-600 mt-2">
            {description}
          </DialogDescription>
        </DialogHeader>
        
        <DialogFooter className="flex gap-3 mt-6">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200"
          >
            {cancelText}
          </Button>
          <Button
            variant={getConfirmButtonVariant()}
            onClick={handleConfirm}
            disabled={isLoading}
            className={`flex-1 ${
              type === 'delete' || type === 'reject'
                ? 'bg-red-500 hover:bg-red-600 text-white'
                : type === 'approve'
                ? 'bg-green-500 hover:bg-green-600 text-white'
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Processing...
              </div>
            ) : (
              confirmText || getDefaultConfirmText()
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// Hook for easy confirmation dialogs
export function useConfirmation() {
  const [isOpen, setIsOpen] = useState(false)
  const [config, setConfig] = useState<{
    title: string
    description: string
    type?: 'delete' | 'approve' | 'reject' | 'info'
    confirmText?: string
    cancelText?: string
    onConfirm: () => void
  } | null>(null)

  const confirm = (config: {
    title: string
    description: string
    type?: 'delete' | 'approve' | 'reject' | 'info'
    confirmText?: string
    cancelText?: string
    onConfirm: () => void
  }) => {
    setConfig(config)
    setIsOpen(true)
  }

  const close = () => {
    setIsOpen(false)
    setConfig(null)
  }

  const handleConfirm = () => {
    if (config?.onConfirm) {
      config.onConfirm()
    }
    close()
  }

  return {
    confirm,
    close,
    isOpen,
    config
  }
} 