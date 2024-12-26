export function validateNumber(value: string | number): boolean {
  const num = typeof value === 'string' ? parseFloat(value) : value
  return !isNaN(num) && isFinite(num) && num >= 0
}

export function validateRequired(value: any): boolean {
  if (typeof value === 'string') {
    return value.trim().length > 0
  }
  return value !== null && value !== undefined
}

export function validateDate(date: string): boolean {
  const parsedDate = new Date(date)
  return !isNaN(parsedDate.getTime())
}

export function validatePositiveInteger(value: number): boolean {
  return Number.isInteger(value) && value > 0
}

export function validateDecimal(value: number, maxDecimals: number = 2): boolean {
  const str = value.toString()
  const decimals = str.includes('.') ? str.split('.')[1].length : 0
  return decimals <= maxDecimals
}