import { useEffect, useState } from 'react'
import { WeekData } from '../types/interfaces'
import { getNextWeekData, createInitialWeekData } from '../services/weekService'

export function useNextWeekData(currentYear: number, currentWeek: number) {
  const [nextWeekData, setNextWeekData] = useState<WeekData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchNextWeekData = async () => {
      try {
        setIsLoading(true)
        let nextYear = currentYear
        let nextWeek = currentWeek + 1
        
        if (nextWeek > 52) {
          nextWeek = 1
          nextYear++
        }

        let data = await getNextWeekData(currentYear, currentWeek)
        
        if (!data) {
          data = await createInitialWeekData(nextYear, nextWeek)
        }

        setNextWeekData(data)
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch next week data'))
      } finally {
        setIsLoading(false)
      }
    }

    fetchNextWeekData()
  }, [currentYear, currentWeek])

  return { nextWeekData, isLoading, error }
}