export const ariaLabels = {
  loading: 'Chargement en cours',
  required: 'Champ obligatoire',
  error: 'Erreur',
  success: 'Succès',
  close: 'Fermer',
  open: 'Ouvrir',
  next: 'Suivant',
  previous: 'Précédent',
  search: 'Rechercher',
  select: 'Sélectionner',
  selected: 'Sélectionné',
  toggle: 'Basculer',
  expand: 'Développer',
  collapse: 'Réduire',
  menu: 'Menu',
  submenu: 'Sous-menu',
  navigation: 'Navigation',
  main: 'Contenu principal',
}

export function getAriaLabel(key: keyof typeof ariaLabels, suffix?: string): string {
  return suffix ? `${ariaLabels[key]} ${suffix}` : ariaLabels[key]
}

export const focusableElements = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ')

export function trapFocus(element: HTMLElement): () => void {
  const focusableContent = element.querySelectorAll(focusableElements)
  const firstFocusable = focusableContent[0] as HTMLElement
  const lastFocusable = focusableContent[focusableContent.length - 1] as HTMLElement

  function handleTabKey(e: KeyboardEvent) {
    if (e.key !== 'Tab') return

    if (e.shiftKey) {
      if (document.activeElement === firstFocusable) {
        lastFocusable.focus()
        e.preventDefault()
      }
    } else {
      if (document.activeElement === lastFocusable) {
        firstFocusable.focus()
        e.preventDefault()
      }
    }
  }

  element.addEventListener('keydown', handleTabKey)
  return () => element.removeEventListener('keydown', handleTabKey)
}