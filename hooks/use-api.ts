import { useState, useEffect, useCallback } from 'react'
import { toast } from '@/components/ui/use-toast'

interface UseApiOptions<T> {
  initialData?: T
  onSuccess?: (data: T) => void
  onError?: (error: Error) => void
  retryCount?: number
  retryDelay?: number
  cacheTime?: number
}

interface UseApiResult<T> {
  data: T | null
  isLoading: boolean
  error: Error | null
  refetch: () => Promise<void>
}

export function useApi<T>(
  fetchFn: () => Promise<T>,
  options: UseApiOptions<T> = {}
): UseApiResult<T> {
  const {
    initialData = null,
    onSuccess,
    onError,
    retryCount = 3,
    retryDelay = 1000,
    cacheTime = 5 * 60 * 1000, // 5 minutes
  } = options

  const [data, setData] = useState<T | null>(initialData)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [lastFetchTime, setLastFetchTime] = useState<number>(0)

  const fetchData = useCallback(async (retryAttempt = 0) => {
    try {
      setIsLoading(true)
      setError(null)

      const result = await fetchFn()
      setData(result)
      setLastFetchTime(Date.now())
      onSuccess?.(result)
    } catch (err) {
      const error = err instanceof Error ? err : new Error('An error occurred')
      setError(error)
      onError?.(error)

      if (retryAttempt < retryCount) {
        setTimeout(() => {
          fetchData(retryAttempt + 1)
        }, retryDelay * Math.pow(2, retryAttempt))
      } else {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        })
      }
    } finally {
      setIsLoading(false)
    }
  }, [fetchFn, onSuccess, onError, retryCount, retryDelay])

  useEffect(() => {
    const shouldRefetch = Date.now() - lastFetchTime > cacheTime
    if (shouldRefetch) {
      fetchData()
    }
  }, [fetchData, lastFetchTime, cacheTime])

  return {
    data,
    isLoading,
    error,
    refetch: () => fetchData(),
  }
} 