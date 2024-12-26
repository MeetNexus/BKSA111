import { useCallback, useEffect } from 'react'

interface KeyboardNavigationOptions {
  onEscape?: () => void
  onEnter?: () => void
  onArrowUp?: () => void
  onArrowDown?: () => void
  onTab?: (event: KeyboardEvent) => void
  disabled?: boolean
}

export function useKeyboardNavigation(options: KeyboardNavigationOptions) {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (options.disabled) return

      switch (event.key) {
        case 'Escape':
          options.onEscape?.()
          break
        case 'Enter':
          options.onEnter?.()
          break
        case 'ArrowUp':
          options.onArrowUp?.()
          event.preventDefault()
          break
        case 'ArrowDown':
          options.onArrowDown?.()
          event.preventDefault()
          break
        case 'Tab':
          options.onTab?.(event)
          break
      }
    },
    [options]
  )

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])
}