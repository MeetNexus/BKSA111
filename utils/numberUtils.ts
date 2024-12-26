export function formatNumber(value: number | string | undefined, decimals: number = 3): string {
  if (value === undefined || value === '') return ''
  
  const num = typeof value === 'string' ? parseFloat(value) : value
  if (isNaN(num)) return ''
  
  return num.toFixed(decimals)
}