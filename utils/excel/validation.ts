import { Product } from '../../types/interfaces'

export function isValidProduct(product: Partial<Product>): boolean {
  return !!(
    product.reference_produit &&
    product.nom_produit &&
    product.code_destination &&
    product.unite_stock
  )
}

export function validateExcelRow(row: any[]): boolean {
  if (!row || row.length === 0) return false
  
  // Vérifier que la ligne contient au moins une valeur non vide
  return row.some(cell => cell !== undefined && cell !== null && cell !== '')
}