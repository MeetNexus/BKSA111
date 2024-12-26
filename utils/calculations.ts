import { Product, WeekData, Order } from '../types/interfaces'
import { addDays, isBefore, isAfter, isSameDay } from 'date-fns'

export function convertToUnits(value: number, product: Product): number {
  if (!product.unit_conversion) return value
  
  const { number_of_packs, units_per_pack } = product.unit_conversion
  if (!number_of_packs || !units_per_pack) return value
  
  return value * number_of_packs * units_per_pack
}

export function convertToPackages(value: number, product: Product): number {
  if (!product.unit_conversion) return value
  
  const { number_of_packs, units_per_pack } = product.unit_conversion
  if (!number_of_packs || !units_per_pack) return value
  
  const totalUnitsPerPackage = number_of_packs * units_per_pack
  return Math.round((value / totalUnitsPerPackage) * 100) / 100
}

export function calculateTheoreticalStock(
  order: Order,
  product: Product,
  previousOrders: Order[],
  previousWeekOrders: Order[]
): number {
  let theoreticalStock = 0

  switch (order.order_number) {
    case 1: {
      // Get last order from previous week (order 3)
      const prevWeekOrder = previousWeekOrders.find(o => o.order_number === 3)
      if (prevWeekOrder) {
        const prevStock = prevWeekOrder.real_stock?.[product.id!] || 
                         prevWeekOrder.theoretical_stock?.[product.id!] || 0
        const prevOrderedQty = prevWeekOrder.ordered_quantities?.[product.id!] || 0
        theoreticalStock = prevStock + convertToUnits(prevOrderedQty, product)
      }
      break
    }
    case 2: {
      // Get order 1 from current week
      const prevOrder = previousOrders.find(o => o.order_number === 1)
      if (prevOrder) {
        const prevStock = prevOrder.real_stock?.[product.id!] || 
                         prevOrder.theoretical_stock?.[product.id!] || 0
        const prevOrderedQty = prevOrder.ordered_quantities?.[product.id!] || 0
        theoreticalStock = prevStock + convertToUnits(prevOrderedQty, product)
      }
      break
    }
    case 3: {
      // Get order 2 from current week
      const prevOrder = previousOrders.find(o => o.order_number === 2)
      if (prevOrder) {
        const prevStock = prevOrder.real_stock?.[product.id!] || 
                         prevOrder.theoretical_stock?.[product.id!] || 0
        const prevOrderedQty = prevOrder.ordered_quantities?.[product.id!] || 0
        theoreticalStock = prevStock + convertToUnits(prevOrderedQty, product)
      }
      break
    }
  }

  return theoreticalStock
}

export function calculateConsumption(
  product: Product,
  weekData: WeekData,
  nextWeekData: WeekData | null,
  order: Order
): number {
  if (!weekData.consumption_data || !product.reference_produit) return 0

  const consumptionPer1000 = weekData.consumption_data[product.reference_produit] || 0
  const { startDate, endDate } = getOrderPeriod(order)
  const periodSalesForecast = calculatePeriodSalesForecast(weekData, nextWeekData, startDate, endDate)
  
  return (consumptionPer1000 * periodSalesForecast) / 1000
}

export function getOrderPeriod(order: Order): { startDate: Date; endDate: Date } {
  const deliveryDate = new Date(order.delivery_date)

  switch (order.order_number) {
    case 1: 
      return {
        startDate: addDays(deliveryDate, -3), // Monday
        endDate: addDays(deliveryDate, 2), // Saturday
      }
    case 2: 
      return {
        startDate: addDays(deliveryDate, -3), // Wednesday
        endDate: addDays(addDays(deliveryDate, 7), 2), // Tuesday next week
      }
    case 3: 
      return {
        startDate: addDays(deliveryDate, -4), // Friday
        endDate: addDays(addDays(deliveryDate, 7), 2), // Thursday next week
      }
    default:
      throw new Error('Invalid order number')
  }
}

export function calculatePeriodSalesForecast(
  weekData: WeekData,
  nextWeekData: WeekData | null,
  startDate: Date,
  endDate: Date
): number {
  let totalForecast = 0

  // Current week forecasts
  if (weekData.sales_forecast) {
    totalForecast += Object.entries(weekData.sales_forecast)
      .filter(([date]) => {
        const forecastDate = new Date(date)
        return (
          (isAfter(forecastDate, startDate) || isSameDay(forecastDate, startDate)) &&
          (isBefore(forecastDate, endDate) || isSameDay(forecastDate, endDate))
        )
      })
      .reduce((total, [_, forecast]) => total + forecast, 0)
  }

  // Next week forecasts if needed
  if (nextWeekData?.sales_forecast) {
    totalForecast += Object.entries(nextWeekData.sales_forecast)
      .filter(([date]) => {
        const forecastDate = new Date(date)
        return (
          (isAfter(forecastDate, startDate) || isSameDay(forecastDate, startDate)) &&
          (isBefore(forecastDate, endDate) || isSameDay(forecastDate, endDate))
        )
      })
      .reduce((total, [_, forecast]) => total + forecast, 0)
  }

  return totalForecast
}

export function calculateOrderNeeds(
  order: Order,
  weekData: WeekData,
  nextWeekData: WeekData | null,
  product: Product,
  previousOrders: Order[],
  previousWeekOrders: Order[]
): number {
  // Convert stock from packages to units
  const stockInPackages = order.real_stock?.[product.id!] || 
                          order.theoretical_stock?.[product.id!] || 
                          calculateTheoreticalStock(order, product, previousOrders, previousWeekOrders)
  const stockInUnits = convertToUnits(stockInPackages, product)

  const consumption = calculateConsumption(product, weekData, nextWeekData, order)

  // Retrieve and convert the ordered quantity from the previous order
  let previousOrderedQuantityInUnits = 0
  if (order.order_number === 1) {
    const previousWeekOrder = previousWeekOrders.find(o => o.order_number === 3)
    const previousOrderedQuantityInPackages = previousWeekOrder?.ordered_quantities?.[product.id!] || 0
    previousOrderedQuantityInUnits = convertToUnits(previousOrderedQuantityInPackages, product)
  } else {
    const previousOrder = previousOrders.find(o => o.order_number === order.order_number - 1)
    const previousOrderedQuantityInPackages = previousOrder?.ordered_quantities?.[product.id!] || 0
    previousOrderedQuantityInUnits = convertToUnits(previousOrderedQuantityInPackages, product)
  }

  // Adjust needs calculation to include previous ordered quantity
  return consumption - stockInUnits - previousOrderedQuantityInUnits
}