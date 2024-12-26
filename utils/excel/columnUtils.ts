export function columnToIndex(column: string): number {
  let result = 0
  for (let i = 0; i < column.length; i++) {
    result *= 26
    result += column.charCodeAt(i) - 'A'.charCodeAt(0) + 1
  }
  return result - 1
}

export function getColumnValue(row: any[], columnIndex: number): string {
  const value = row[columnIndex]
  if (value === undefined || value === null) return ''
  return String(value)
}

export function parseConsumptionValue(value: string | number): number {
  if (typeof value === 'number') return value
  if (typeof value === 'string') {
    // Handle string format (e.g., "1,234" or "1.234")
    return parseFloat(value.replace(',', '.'))
  }
  return 0
}