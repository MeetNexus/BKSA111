import { supabase } from '../utils/supabaseClient'
import { Product } from '../types/interfaces'
import { DATABASE_TABLES, PRODUCT_FIELDS } from '../constants/database'
import { toast } from 'react-hot-toast'

import { AppError } from '../utils/errorHandling'

export async function getProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from(DATABASE_TABLES.PRODUCTS)
    .select('*')
    .order('nom_produit')

  if (error) {
    throw new AppError(
      'Erreur lors de la récupération des produits',
      'PRODUCTS_FETCH_ERROR',
      500
    )
  }

  return data as Product[]
}

export async function toggleProductVisibility(productId: number, isHidden: boolean): Promise<Product> {
  try {
    const { data, error } = await supabase
      .from(DATABASE_TABLES.PRODUCTS)
      .update({ [PRODUCT_FIELDS.IS_HIDDEN]: isHidden })
      .eq('id', productId)
      .select()
      .single()

    if (error) throw error

    return data as Product
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la visibilité du produit:', error)
    throw error
  }
}

export async function upsertProducts(products: Product[]): Promise<void> {
  const { error } = await supabase
    .from(DATABASE_TABLES.PRODUCTS)
    .upsert(products, { 
      onConflict: PRODUCT_FIELDS.REFERENCE,
      ignoreDuplicates: false
    })

  if (error) {
    console.error('Erreur lors de la mise à jour des produits :', error)
    throw error
  }
}

export async function updateProduct(product: Product): Promise<Product> {
  const { data, error } = await supabase
    .from(DATABASE_TABLES.PRODUCTS)
    .update(product)
    .eq('id', product.id)
    .select()
    .single()

  if (error) {
    console.error('Erreur lors de la mise à jour du produit :', error)
    throw error
  }

  return data as Product
}

export async function deleteProduct(id: number): Promise<void> {
  const { error } = await supabase
    .from(DATABASE_TABLES.PRODUCTS)
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Erreur lors de la suppression du produit :', error)
    throw error
  }
}