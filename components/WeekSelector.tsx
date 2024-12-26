import React, { useState, useEffect } from 'react'
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  isSameDay,
  addDays,
  startOfWeek,
  endOfWeek,
  getISOWeek,
  getYear,
  getMonth,
  addMonths,
  subMonths
} from 'date-fns'
import { fr } from 'date-fns/locale'
import { Card, CardContent, CardHeader } from './ui/Card'
import Button from './ui/Button'
import { cn } from '../utils/cn'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/outline'
import { getYearAndWeekFromDate, getDateFromYearAndWeek } from '../utils/dateUtils'

interface WeekSelectorProps {
  currentYear: number
  currentMonth: number
  currentWeek: number
  onYearChange: (year: number) => void
  onMonthChange: (month: number) => void
  onWeekChange: (week: number) => void
}

export default function WeekSelector({
  currentYear,
  currentMonth,
  currentWeek,
  onYearChange,
  onMonthChange,
  onWeekChange,
}: WeekSelectorProps) {
  const [selectedDate, setSelectedDate] = useState(() => {
    return getDateFromYearAndWeek(currentYear, currentWeek)
  })

  const [displayDate, setDisplayDate] = useState(() => {
    return new Date(currentYear, currentMonth - 1)
  })

  useEffect(() => {
    const date = getDateFromYearAndWeek(currentYear, currentWeek)
    setSelectedDate(date)
    setDisplayDate(date)
  }, [currentYear, currentWeek])

  const monthStart = startOfMonth(displayDate)
  const monthEnd = endOfMonth(displayDate)
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 })
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 })
  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd })

  const weeks = calendarDays.reduce((weeks: Date[][], day, index) => {
    const weekIndex = Math.floor(index / 7)
    weeks[weekIndex] = weeks[weekIndex] || []
    weeks[weekIndex].push(day)
    return weeks
  }, [])

  const handlePrevMonth = () => {
    setDisplayDate(prevDate => {
      const newDate = subMonths(prevDate, 1)
      return newDate
    })
  }

  const handleNextMonth = () => {
    setDisplayDate(prevDate => {
      const newDate = addMonths(prevDate, 1)
      return newDate
    })
  }

  const isSelectedWeek = (date: Date) => {
    const selectedWeekStart = startOfWeek(selectedDate, { weekStartsOn: 1 })
    const dateWeekStart = startOfWeek(date, { weekStartsOn: 1 })
    return isSameDay(selectedWeekStart, dateWeekStart)
  }

  const handleWeekClick = (date: Date) => {
    const { year, week } = getYearAndWeekFromDate(date)
    setSelectedDate(date)
    
    // Only update month if it's different from current display month
    if (getMonth(date) !== getMonth(displayDate)) {
      setDisplayDate(date)
    }
    
    if (year !== currentYear || week !== currentWeek) {
      onYearChange(year)
      onWeekChange(week)
      onMonthChange(getMonth(date) + 1)
    }
  }

  const weekDays = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']

  return (
    <Card variant="colored" className="max-w-2xl mx-auto mb-6">
      <CardHeader className="text-center border-b border-bk-yellow/20">
        <div className="flex items-center justify-center space-x-4">
          <Button variant="secondary" size="sm" onClick={handlePrevMonth}>
            <ChevronLeftIcon className="h-5 w-5" />
          </Button>
          <h2 className="text-xl font-flame font-bold text-bk-brown min-w-40 text-center">
            {format(displayDate, 'MMMM yyyy', { locale: fr })}
          </h2>
          <Button variant="secondary" size="sm" onClick={handleNextMonth}>
            <ChevronRightIcon className="h-5 w-5" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="grid grid-cols-7 gap-1">
          {weekDays.map((day) => (
            <div
              key={day}
              className="text-center py-2 text-sm font-flame font-semibold text-bk-brown"
            >
              {day}
            </div>
          ))}
          {weeks.map((week, weekIndex) => (
            <React.Fragment key={weekIndex}>
              {week.map((day, dayIndex) => {
                const isCurrentMonth = day.getMonth() === displayDate.getMonth()
                const isToday = isSameDay(day, new Date())
                const isSelected = isSelectedWeek(day)

                return (
                  <button
                    key={dayIndex}
                    onClick={() => handleWeekClick(day)}
                    className={cn(
                      'p-2 text-sm relative group transition-colors rounded-lg',
                      isCurrentMonth ? 'text-bk-brown' : 'text-gray-400',
                      isSelected && 'bg-bk-yellow/20',
                      'hover:bg-bk-yellow/10',
                      'focus:outline-none focus:ring-2 focus:ring-bk-yellow focus:ring-opacity-50'
                    )}
                  >
                    <span
                      className={cn(
                        'flex items-center justify-center w-8 h-8 mx-auto rounded-full',
                        isToday && 'bg-bk-yellow text-bk-brown font-bold'
                      )}
                    >
                      {format(day, 'd')}
                    </span>
                    {isSelected && (
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-bk-yellow rounded-full" />
                    )}
                  </button>
                )
              })}
            </React.Fragment>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}