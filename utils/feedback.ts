import { toast } from 'react-hot-toast'

export type FeedbackType = 'success' | 'error' | 'info' | 'loading'

interface FeedbackOptions {
  duration?: number
  icon?: string
}

export function showFeedback(message: string, type: FeedbackType, options: FeedbackOptions = {}) {
  const { duration = 3000 } = options

  switch (type) {
    case 'success':
      return toast.success(message, { duration })
    case 'error':
      return toast.error(message, { duration })
    case 'info':
      return toast(message, { duration })
    case 'loading':
      return toast.loading(message)
  }
}

export function dismissFeedback(toastId: string) {
  toast.dismiss(toastId)
}

export const feedbackMessages = {
  loading: {
    dataFetch: 'Chargement des données...',
    import: 'Importation en cours...',
    save: 'Enregistrement...',
    update: 'Mise à jour...',
  },
  success: {
    import: 'Importation réussie',
    save: 'Enregistrement effectué',
    update: 'Mise à jour effectuée',
  },
  error: {
    dataFetch: 'Erreur lors du chargement des données',
    import: 'Erreur lors de l\'importation',
    save: 'Erreur lors de l\'enregistrement',
    update: 'Erreur lors de la mise à jour',
    validation: 'Veuillez vérifier les données saisies',
  },
}