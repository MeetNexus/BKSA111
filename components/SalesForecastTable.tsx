import { useState, useEffect } from 'react'
import { WeekData } from '../types/interfaces'
import { Card, CardContent, CardHeader } from './ui/Card'
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from './ui/Table'
import Input from './ui/Input'
import { format, parseISO } from 'date-fns'
import { fr } from 'date-fns/locale'
import { toast } from 'react-hot-toast'

interface SalesForecastTableProps {
  weekData: WeekData | null
  weekDates: { date: string; dayName: string }[]
  onSalesForecastChange: (date: string, value: number) => Promise<void>
}

export default function SalesForecastTable({
  weekData,
  weekDates,
  onSalesForecastChange,
}: SalesForecastTableProps) {
  const [inputValues, setInputValues] = useState<{ [date: string]: string }>(
    weekData?.sales_forecast || {}
  )

  // Update input values when weekData changes
  useEffect(() => {
    setInputValues(weekData?.sales_forecast || {})
  }, [weekData])

  const handleInputChange = (date: string, value: string) => {
    setInputValues(prev => ({
      ...prev,
      [date]: value
    }))
  }

  const handleBlur = async (date: string) => {
    const value = inputValues[date]
    const numValue = parseFloat(value)
    
    if (!isNaN(numValue) && numValue !== weekData?.sales_forecast?.[date]) {
      try {
        await onSalesForecastChange(date, numValue)
      } catch (error) {
        toast.error('Erreur lors de la mise à jour')
        console.error('Error updating sales forecast:', error)
        // Reset to previous value on error
        setInputValues(prev => ({
          ...prev,
          [date]: weekData?.sales_forecast?.[date]?.toString() || ''
        }))
      }
    }
  }

  return (
    <Card variant="colored" className="mb-6">
      <CardHeader className="border-b border-bk-yellow/20">
        <h2 className="text-xl font-flame font-bold text-center text-bk-brown">
          Prévisions de Chiffre d&apos;Affaires
        </h2>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-1/2">Date</TableHead>
              <TableHead className="w-1/2">Prévision (€)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {weekDates.map(({ date, dayName }) => (
              <TableRow key={date}>
                <TableCell className="font-medium">
                  {dayName} {format(parseISO(date), 'dd/MM/yyyy', { locale: fr })}
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    value={inputValues[date] || ''}
                    onChange={(e) => handleInputChange(date, e.target.value)}
                    onBlur={() => handleBlur(date)}
                    className="w-full"
                    min="0"
                    step="100"
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}