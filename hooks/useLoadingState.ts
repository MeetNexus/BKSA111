import { useState, useCallback } from 'react'
import { showFeedback, dismissFeedback } from '../utils/feedback'

export function useLoadingState(initialState: boolean = false) {
  const [isLoading, setIsLoading] = useState(initialState)
  const [loadingToastId, setLoadingToastId] = useState<string | null>(null)

  const startLoading = useCallback((message?: string) => {
    setIsLoading(true)
    if (message) {
      const toastId = showFeedback(message, 'loading')
      setLoadingToastId(toastId)
    }
  }, [])

  const stopLoading = useCallback((successMessage?: string, errorMessage?: string) => {
    setIsLoading(false)
    if (loadingToastId) {
      dismissFeedback(loadingToastId)
      setLoadingToastId(null)
    }
    if (successMessage) {
      showFeedback(successMessage, 'success')
    }
    if (errorMessage) {
      showFeedback(errorMessage, 'error')
    }
  }, [loadingToastId])

  return {
    isLoading,
    startLoading,
    stopLoading
  }
}