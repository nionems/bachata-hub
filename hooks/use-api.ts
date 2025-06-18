import { useState, useCallback } from 'react'
import { toast } from '@/components/ui/use-toast'

interface UseApiOptions<T> {
  onSuccess?: (data: T) => void
  onError?: (error: Error) => void
  successMessage?: string
  errorMessage?: string
}

export function useApi<T>() {
  const [data, setData] = useState<T | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const execute = useCallback(async (
    request: () => Promise<T>,
    options: UseApiOptions<T> = {}
  ) => {
    const {
      onSuccess,
      onError,
      successMessage,
      errorMessage = 'An error occurred'
    } = options

    setIsLoading(true)
    setError(null)

    try {
      const result = await request()
      setData(result)
      if (successMessage) {
        toast({
          title: "Success",
          description: successMessage,
        })
      }
      onSuccess?.(result)
      return result
    } catch (err) {
      const error = err instanceof Error ? err : new Error(errorMessage)
      setError(error)
      if (errorMessage) {
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        })
      }
      onError?.(error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [])

  return {
    data,
    isLoading,
    error,
    execute,
    setData,
    setError
  }
} 