import { supabase } from '../utils/supabaseClient'
import { Order } from '../types/interfaces'
import { DATABASE_TABLES, ORDER_FIELDS } from '../constants/database'
import { getWeekData } from './weekService'
import { handleError } from '../utils/errorHandling'

export async function getOrdersForWeek(weekDataId: number): Promise<Order[]> {
  try {
    const { data, error } = await supabase
      .from(DATABASE_TABLES.ORDERS)
      .select('*')
      .eq(ORDER_FIELDS.WEEK_DATA_ID, weekDataId)

    if (error) throw error
    return data as Order[]
  } catch (error) {
    handleError(error, 'Erreur lors de la récupération des commandes')
    return []
  }
}

export async function getPreviousWeekOrders(year: number, weekNumber: number): Promise<Order[]> {
  try {
    // Calculate previous week
    const prevWeek = weekNumber === 1 ? 52 : weekNumber - 1
    const prevYear = weekNumber === 1 ? year - 1 : year
    
    // Get previous week's data
    const prevWeekData = await getWeekData(prevYear, prevWeek)
    if (!prevWeekData?.id) return []
    
    // Get orders for previous week
    return await getOrdersForWeek(prevWeekData.id)
  } catch (error) {
    handleError(error, 'Erreur lors de la récupération des commandes précédentes')
    return []
  }
}

export async function updateOrderStock(orderId: number, productId: number, value: number | null): Promise<void> {
  try {
    const { data: order, error: fetchError } = await supabase
      .from(DATABASE_TABLES.ORDERS)
      .select('real_stock')
      .eq('id', orderId)
      .single()

    if (fetchError) throw fetchError

    const updatedStock = { ...order.real_stock }
    
    if (value === null) {
      // Remove the stock entry if value is null
      delete updatedStock[productId]
    } else {
      // Update with new value
      updatedStock[productId] = value
    }

    const { error: updateError } = await supabase
      .from(DATABASE_TABLES.ORDERS)
      .update({ real_stock: updatedStock })
      .eq('id', orderId)

    if (updateError) throw updateError
  } catch (error) {
    handleError(error, 'Erreur lors de la mise à jour du stock')
    throw error
  }
}

export async function createInitialOrders(weekDataId: number, deliveryDates: string[]): Promise<void> {
  try {
    const orders = deliveryDates.map((date, index) => ({
      week_data_id: weekDataId,
      order_number: index + 1,
      delivery_date: date,
      real_stock: {},
      needs: {},
      ordered_quantities: {}
    }))

    const { error } = await supabase
      .from(DATABASE_TABLES.ORDERS)
      .upsert(orders, {
        onConflict: 'week_data_id,order_number'
      })

    if (error) throw error
  } catch (error) {
    handleError(error, 'Erreur lors de la création des commandes initiales')
    throw error
  }
}

export async function updateOrderQuantity(orderId: number, productId: number, value: number | null): Promise<void> {
  try {
    const { data: order, error: fetchError } = await supabase
      .from(DATABASE_TABLES.ORDERS)
      .select('ordered_quantities')
      .eq('id', orderId)
      .single()

    if (fetchError) throw fetchError

    const updatedQuantities = { ...order.ordered_quantities }
    
    if (value === null) {
      // Remove the quantity entry if value is null
      delete updatedQuantities[productId]
    } else {
      // Update with new value
      updatedQuantities[productId] = value
    }

    const { error: updateError } = await supabase
      .from(DATABASE_TABLES.ORDERS)
      .update({ ordered_quantities: updatedQuantities })
      .eq('id', orderId)

    if (updateError) throw updateError
  } catch (error) {
    handleError(error, 'Erreur lors de la mise à jour de la quantité commandée')
    throw error
  }
}