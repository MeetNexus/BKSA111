import { useState, useMemo } from 'react'

export type SortDirection = 'asc' | 'desc'

export interface SortConfig {
  key: string
  direction: SortDirection
}

type SortValue = string | number | boolean | null | undefined

function compareValues(a: SortValue, b: SortValue, direction: SortDirection): number {
  // Handle undefined/null values
  if (a == null && b == null) return 0
  if (a == null) return direction === 'asc' ? 1 : -1
  if (b == null) return direction === 'asc' ? -1 : 1

  // Handle numbers
  if (typeof a === 'number' && typeof b === 'number') {
    return direction === 'asc' ? a - b : b - a
  }

  // Handle booleans
  if (typeof a === 'boolean' && typeof b === 'boolean') {
    const aNum = a ? 1 : 0
    const bNum = b ? 1 : 0
    return direction === 'asc' ? aNum - bNum : bNum - aNum
  }

  // Handle strings (case-insensitive)
  const aStr = String(a).toLowerCase()
  const bStr = String(b).toLowerCase()
  
  if (aStr < bStr) return direction === 'asc' ? -1 : 1
  if (aStr > bStr) return direction === 'asc' ? 1 : -1
  return 0
}

function getNestedValue(obj: any, path: string): SortValue {
  if (!obj || !path) return undefined
  
  return path.split('.').reduce((acc, part) => {
    if (acc === null || acc === undefined) return undefined
    return acc[part]
  }, obj)
}

export function useSorting<T>(
  items: T[] | undefined,
  initialSort: SortConfig
) {
  const [sortConfig, setSortConfig] = useState<SortConfig>(initialSort)

  const sortedItems = useMemo(() => {
    if (!items) return items

    return [...items].sort((a, b) => {
      const valueA = getNestedValue(a, sortConfig.key)
      const valueB = getNestedValue(b, sortConfig.key)

      return compareValues(valueA, valueB, sortConfig.direction)
    })
  }, [items, sortConfig])

  const requestSort = (key: string) => {
    setSortConfig((currentConfig) => ({
      key,
      direction: 
        currentConfig.key === key && currentConfig.direction === 'asc' 
          ? 'desc' 
          : 'asc'
    }))
  }

  return { sortedItems, sortConfig, requestSort }
}