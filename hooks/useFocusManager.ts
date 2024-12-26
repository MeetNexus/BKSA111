import { useCallback, useRef } from 'react'

export function useFocusManager() {
  const focusRef = useRef<HTMLElement | null>(null)

  const setFocusRef = useCallback((element: HTMLElement | null) => {
    focusRef.current = element
  }, [])

  const focus = useCallback(() => {
    if (focusRef.current) {
      focusRef.current.focus()
    }
  }, [])

  const focusWithDelay = useCallback((delay: number = 100) => {
    setTimeout(focus, delay)
  }, [focus])

  return {
    setFocusRef,
    focus,
    focusWithDelay
  }
}