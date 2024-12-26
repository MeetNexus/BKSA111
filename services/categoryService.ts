// services/categoryService.ts

import { supabase } from '../utils/supabaseClient'
import { Category } from '../types/interfaces'

export async function getCategories(): Promise<Category[]> {
  const { data, error } = await supabase.from('categories').select('*')

  if (error) {
    console.error('Erreur lors de la récupération des catégories :', error)
    throw error
  }

  return data as Category[]
}

export async function createCategory(name: string): Promise<Category> {
  const { data, error } = await supabase
    .from('categories')
    .insert({ name })
    .single()

  if (error) {
    console.error('Erreur lors de la création de la catégorie :', error)
    throw error
  }

  return data as Category
}

export async function getCategoryById(id: number): Promise<Category | null> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      // Pas de catégorie trouvée
      return null
    } else {
      console.error('Erreur lors de la récupération de la catégorie :', error)
      throw error
    }
  }

  if (!data) {
    return null
  }

  return data as Category
}

export async function updateCategory(category: Category): Promise<void> {
  const { error } = await supabase
    .from('categories')
    .update(category)
    .eq('id', category.id)

  if (error) {
    console.error('Erreur lors de la mise à jour de la catégorie :', error)
    throw error
  }
}

export async function deleteCategory(id: number): Promise<void> {
  const { error } = await supabase
    .from('categories')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Erreur lors de la suppression de la catégorie :', error)
    throw error
  }
}
