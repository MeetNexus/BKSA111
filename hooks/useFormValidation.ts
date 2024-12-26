import { useState, useCallback } from 'react'
import { validateRequired, validateNumber, validateDate } from '../utils/validation'
import { showFeedback } from '../utils/feedback'

type ValidationRule = 'required' | 'number' | 'date' | 'custom'

interface ValidationConfig {
  [field: string]: {
    rules: ValidationRule[]
    customValidation?: (value: any) => boolean
    message?: string
  }
}

export function useFormValidation<T extends Record<string, any>>(config: ValidationConfig) {
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({})

  const validateField = useCallback((field: keyof T, value: any) => {
    const fieldConfig = config[field as string]
    if (!fieldConfig) return true

    for (const rule of fieldConfig.rules) {
      switch (rule) {
        case 'required':
          if (!validateRequired(value)) {
            return fieldConfig.message || 'Ce champ est requis'
          }
          break
        case 'number':
          if (!validateNumber(value)) {
            return fieldConfig.message || 'Veuillez entrer un nombre valide'
          }
          break
        case 'date':
          if (!validateDate(value)) {
            return fieldConfig.message || 'Veuillez entrer une date valide'
          }
          break
        case 'custom':
          if (fieldConfig.customValidation && !fieldConfig.customValidation(value)) {
            return fieldConfig.message || 'Valeur invalide'
          }
          break
      }
    }
    return ''
  }, [config])

  const validateForm = useCallback((data: T) => {
    const newErrors: Partial<Record<keyof T, string>> = {}
    let isValid = true

    Object.keys(config).forEach((field) => {
      const error = validateField(field as keyof T, data[field])
      if (error) {
        newErrors[field as keyof T] = error
        isValid = false
      }
    })

    setErrors(newErrors)
    if (!isValid) {
      showFeedback('Veuillez corriger les erreurs dans le formulaire', 'error')
    }
    return isValid
  }, [config, validateField])

  return {
    errors,
    validateField,
    validateForm,
    setErrors
  }
}