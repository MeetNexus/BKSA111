import { supabase } from '../utils/supabaseClient'
import { WeekData } from '../types/interfaces'
import { DATABASE_TABLES, WEEK_DATA_FIELDS } from '../constants/database'
import { toast } from 'react-hot-toast'

export async function getWeekData(year: number, weekNumber: number): Promise<WeekData | null> {
  try {
    const { data, error } = await supabase
      .from(DATABASE_TABLES.WEEKS_DATA)
      .select('*')
      .eq(WEEK_DATA_FIELDS.YEAR, year)
      .eq(WEEK_DATA_FIELDS.WEEK_NUMBER, weekNumber)
      .maybeSingle()

    if (error) {
      console.error('Erreur lors de la récupération des données de la semaine :', error)
      throw error
    }

    return data as WeekData | null
  } catch (error) {
    console.error('Erreur inattendue:', error)
    return null
  }
}

export async function getNextWeekData(year: number, weekNumber: number): Promise<WeekData | null> {
  let nextYear = year
  let nextWeek = weekNumber + 1
  
  if (nextWeek > 52) {
    nextWeek = 1
    nextYear++
  }

  return getWeekData(nextYear, nextWeek)
}

export async function upsertWeekData(weekData: WeekData): Promise<WeekData | null> {
  try {
    if (!weekData.year || !weekData.week_number) {
      throw new Error('Year and week number are required')
    }

    const existingData = await getWeekData(weekData.year, weekData.week_number)

    if (existingData) {
      const { data, error } = await supabase
        .from(DATABASE_TABLES.WEEKS_DATA)
        .update({
          consumption_data: {
            ...existingData.consumption_data,
            ...weekData.consumption_data
          },
          sales_forecast: {
            ...existingData.sales_forecast,
            ...weekData.sales_forecast
          }
        })
        .eq('id', existingData.id)
        .select()
        .single()

      if (error) {
        console.error('Erreur lors de la mise à jour des données:', error)
        throw error
      }

      return data as WeekData
    } else {
      const { data, error } = await supabase
        .from(DATABASE_TABLES.WEEKS_DATA)
        .insert({
          year: weekData.year,
          week_number: weekData.week_number,
          consumption_data: weekData.consumption_data || {},
          sales_forecast: weekData.sales_forecast || {}
        })
        .select()
        .single()

      if (error) {
        console.error('Erreur lors de l\'insertion des données:', error)
        throw error
      }

      return data as WeekData
    }
  } catch (error: any) {
    console.error('Erreur lors de la mise à jour des données de la semaine:', error)
    toast.error(error.message || "Erreur lors de la mise à jour des données")
    return null
  }
}

export async function createInitialWeekData(year: number, weekNumber: number): Promise<WeekData | null> {
  try {
    const existingData = await getWeekData(year, weekNumber)
    if (existingData) {
      return existingData
    }

    const initialData: WeekData = {
      year,
      week_number: weekNumber,
      consumption_data: {},
      sales_forecast: {}
    }

    const { data, error } = await supabase
      .from(DATABASE_TABLES.WEEKS_DATA)
      .insert(initialData)
      .select()
      .single()

    if (error) {
      if (error.code === '23505') {
        return await getWeekData(year, weekNumber)
      }
      console.error('Erreur lors de la création des données initiales:', error)
      throw error
    }

    return data as WeekData
  } catch (error) {
    console.error('Erreur lors de la création des données initiales:', error)
    return null
  }
}