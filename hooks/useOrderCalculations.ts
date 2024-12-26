import { useMemo } from 'react'
import { Order, Product, WeekData } from '../types/interfaces'
import { calculateOrderNeeds, calculateTheoreticalStock } from '../utils/calculations'
import { useNextWeekData } from './useNextWeekData'

export function useOrderCalculations(
  order: Order,
  weekData: WeekData,
  products: Product[],
  previousOrders: Order[],
  previousWeekOrders: Order[]
) {
  const { nextWeekData } = useNextWeekData(weekData.year, weekData.week_number)

  const { needs, theoreticalStock } = useMemo(() => {
    const needs: { [productId: number]: number } = {}
    const theoreticalStock: { [productId: number]: number } = {}

    products.forEach(product => {
      // Calculate theoretical stock first
      theoreticalStock[product.id!] = calculateTheoreticalStock(
        order,
        product,
        previousOrders,
        previousWeekOrders
      )

      // Then calculate needs based on theoretical stock
      const need = calculateOrderNeeds(
        order,
        weekData,
        nextWeekData,
        product,
        previousOrders,
        previousWeekOrders
      )
      needs[product.id!] = need
    })

    return { needs, theoreticalStock }
  }, [order, weekData, nextWeekData, products, previousOrders, previousWeekOrders])

  return { needs, theoreticalStock }
}