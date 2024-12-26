import { showFeedback } from './feedback'

export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public status?: number,
    public details?: any
  ) {
    super(message)
    this.name = 'AppError'
  }
}

export function handleError(error: unknown, context?: string): void {
  if (error instanceof AppError) {
    showFeedback(
      context ? `${context}: ${error.message}` : error.message,
      'error'
    )
    console.error(`[${error.code}] ${error.message}`, error.details || '')
  } else if (error instanceof Error) {
    showFeedback(
      context ? `${context}: ${error.message}` : 'Une erreur inattendue est survenue',
      'error'
    )
    console.error(error)
  } else {
    showFeedback(
      context ? `${context}: Une erreur inconnue est survenue` : 'Une erreur inconnue est survenue',
      'error'
    )
    console.error('Unknown error:', error)
  }
}

export function createErrorHandler(context: string) {
  return (error: unknown) => handleError(error, context)
}