export const EXCEL_COLUMNS = {
  CONSUMPTION: {
    letter: 'AO',
    index: 40,
    name: 'Consommation par 1000€',
    description: 'Valeur de consommation pour 1000€ de chiffre d\'affaires'
  },
  CODE_DESTINATION: {
    letter: 'E',
    index: 4,
    name: 'Code Destination',
    description: 'Code identifiant la destination du produit'
  },
  REFERENCE: {
    letter: 'J',
    index: 9,
    name: 'Référence',
    description: 'Référence unique du produit'
  },
  NAME: {
    letter: 'K',
    index: 10,
    name: 'Nom du Produit',
    description: 'Nom complet du produit'
  },
  UNIT: {
    letter: 'L',
    index: 11,
    name: 'Unité de Stock',
    description: 'Unité de mesure pour le stock'
  }
} as const