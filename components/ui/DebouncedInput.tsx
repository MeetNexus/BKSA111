import React, { useState, useEffect } from 'react'
import { useDebounce } from '../../hooks/useDebounce'
import Input from './Input'
import { cn } from '../../utils/cn'
import { formatNumber } from '../../utils/numberUtils'
import { validateNumber } from '../../utils/validation'
import { showFeedback } from '../../utils/feedback'

interface DebouncedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value: number | string
  onChange: (value: number | null) => void
  className?: string
  delay?: number
  min?: number
  max?: number
  allowDecimals?: boolean
  maxDecimals?: number
  isValid?: boolean
}

export default function DebouncedInput({
  value: initialValue,
  onChange,
  className,
  delay = 500,
  min,
  max,
  allowDecimals = true,
  maxDecimals = 3,
  isValid = true,
  ...props
}: DebouncedInputProps) {
  const [value, setValue] = useState<string>(
    initialValue !== undefined && initialValue !== '' ? String(initialValue) : ''
  )
  const debouncedValue = useDebounce(value, delay)

  // Format initial value with up to maxDecimals decimal places
  useEffect(() => {
    setValue(
      initialValue !== undefined && initialValue !== '' ? String(initialValue) : ''
    )
  }, [initialValue])

  useEffect(() => {
    // Only trigger onChange if the value has actually changed
    if (debouncedValue !== String(initialValue)) {
      if (debouncedValue === '') {
        // If the input is empty, pass null to indicate removal
        onChange(null)
      } else {
        const numValue = parseFloat(debouncedValue)
        if (!isNaN(numValue)) {
          // Validate the number
          if (!validateNumber(numValue)) {
            showFeedback('Veuillez entrer un nombre valide', 'error')
            return
          }

          // Clamp value between min and max if provided
          const clampedValue = Math.min(max ?? Infinity, Math.max(min ?? -Infinity, numValue))
          
          // Format to specified decimal places
          const formattedValue = parseFloat(formatNumber(clampedValue, maxDecimals))
          
          if (formattedValue !== initialValue) {
            onChange(formattedValue)
          }
        }
      }
    }
  }, [debouncedValue, onChange, initialValue, min, max, maxDecimals])

  return (
    <Input
      {...props}
      type="number"
      value={value}
      onChange={(e) => {
        const newValue = e.target.value
        // Validate based on whether decimals are allowed
        const validationRegex = allowDecimals 
          ? new RegExp(`^-?\\d*\\.?\\d{0,${maxDecimals}}$`)
          : /^-?\d*$/
        if (newValue === '' || validationRegex.test(newValue)) {
          setValue(newValue)
        }
      }}
      step={allowDecimals ? Math.pow(10, -maxDecimals) : 1}
      className={cn(
        'transition-colors duration-200',
        !isValid && 'border-red-300 focus:border-red-400 focus:ring-red-200',
        className
      )}
      min={min}
      max={max}
    />
  )
}