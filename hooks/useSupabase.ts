import { useState, useEffect } from 'react'
import { supabase } from '../utils/supabaseClient'
import { useQuery, useQueryClient, QueryKey } from 'react-query'
import { createInitialWeekData } from '../services/weekService'
import { toast } from 'react-hot-toast'
import { getCategories } from '../services/categoryService'

interface QueryOptions {
  enabled?: boolean
  staleTime?: number
  cacheTime?: number
  onSuccess?: (data: any) => void
  onError?: (error: any) => void
  refetchInterval?: number | false
}

export function useSupabaseQuery<T>(
  key: QueryKey,
  queryFn: () => Promise<T>,
  options: QueryOptions = {}
) {
  const queryClient = useQueryClient()

  return useQuery(key, queryFn, {
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    onError: (error: any) => {
      console.error('Query error:', error)
      toast.error('Erreur lors de la récupération des données')
    },
    // Disable caching by default to ensure real-time updates
    staleTime: 0,
    cacheTime: 0,
    refetchInterval: 0,
    ...options,
  })
}

export function useCategories() {
  return useSupabaseQuery('categories', async () => {
    const categories = await getCategories()
    return categories
  })
}

export function useProducts() {
  return useSupabaseQuery('products', async () => {
    const { data, error } = await supabase.from('products').select('*')
    if (error) throw error
    return data
  })
}

export function useWeekData(year: number, weekNumber: number) {
  const queryClient = useQueryClient()

  return useSupabaseQuery(['weekData', year, weekNumber], async () => {
    try {
      const { data, error } = await supabase
        .from('weeks_data')
        .select('*')
        .eq('year', year)
        .eq('week_number', weekNumber)
        .maybeSingle()

      if (error) throw error

      if (!data) {
        const newData = await createInitialWeekData(year, weekNumber)
        if (newData) {
          queryClient.invalidateQueries(['weekData', year, weekNumber])
          return newData
        }
      }

      return data
    } catch (error) {
      console.error('Erreur lors de la récupération des données de la semaine:', error)
      throw error
    }
  })
}