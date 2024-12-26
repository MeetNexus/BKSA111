import { 
  startOfWeek, 
  addDays, 
  format, 
  startOfMonth, 
  endOfMonth, 
  getISOWeek,
  getYear,
  parseISO,
  endOfWeek,
  startOfYear,
  endOfYear,
  isLastDayOfYear,
  isFirstDayOfYear,
  isSameDay,
  setISOWeek
} from 'date-fns'
import { fr } from 'date-fns/locale'

export function getCurrentWeekNumber(): number {
  return getISOWeek(new Date())
}

export function getWeeksInMonth(year: number, month: number): number[] {
  const firstDay = startOfMonth(new Date(year, month - 1))
  const lastDay = endOfMonth(new Date(year, month - 1))
  const weeks = new Set<number>()

  let date = firstDay
  while (date <= lastDay) {
    const { year: weekYear, week } = getYearAndWeekFromDate(date)
    if (weekYear === year) {
      weeks.add(week)
    }
    date = addDays(date, 1)
  }

  return Array.from(weeks).sort((a, b) => a - b)
}

export function getDateFromYearAndWeek(year: number, week: number): Date {
  const firstDayOfYear = new Date(year, 0, 1)
  let date = startOfWeek(firstDayOfYear, { weekStartsOn: 1 })
  
  while (getISOWeek(date) !== week || getYear(date) !== year) {
    date = addDays(date, 1)
  }
  
  return startOfWeek(date, { weekStartsOn: 1 })
}

export function getDatesOfWeek(year: number, weekNumber: number): { date: string; dayName: string }[] {
  const weekStart = getDateFromYearAndWeek(year, weekNumber)

  return Array.from({ length: 7 }, (_, i) => {
    const dateObj = addDays(weekStart, i)
    return {
      date: format(dateObj, 'yyyy-MM-dd'),
      dayName: format(dateObj, 'EEEE', { locale: fr }),
    }
  })
}

export function getDeliveryDates(year: number, weekNumber: number): string[] {
  const weekDates = getDatesOfWeek(year, weekNumber)
  const nextWeekDates = getDatesOfWeek(
    weekNumber === 52 ? year + 1 : year,
    weekNumber === 52 ? 1 : weekNumber + 1
  )

  const deliveryDates = [
    weekDates.find((dateObj) => dateObj.dayName.toLowerCase() === 'jeudi')?.date,
    weekDates.find((dateObj) => dateObj.dayName.toLowerCase() === 'samedi')?.date,
    nextWeekDates.find((dateObj) => dateObj.dayName.toLowerCase() === 'mardi')?.date,
  ]

  return deliveryDates.filter(Boolean) as string[]
}

export function getYearAndWeekFromDate(date: Date): { year: number; week: number } {
  const week = getISOWeek(date)
  const year = getYear(date)
  
  // Handle year transition cases
  if (week === 1) {
    // If it's week 1 and in December, it belongs to next year
    if (date.getMonth() === 11) {
      return { year: year + 1, week: 1 }
    }
  } else if (week >= 52) {
    // If it's week 52/53 and in January, it belongs to previous year
    if (date.getMonth() === 0) {
      return { year: year - 1, week }
    }
  }
  
  return { year, week }
}