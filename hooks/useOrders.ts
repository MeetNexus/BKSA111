import { useSupabaseQuery } from './useSupabase'
import { Order, Product } from '../types/interfaces'
import { supabase } from '../utils/supabaseClient'
import { convertToUnits, calculateTheoreticalStock } from '../utils/calculations'
import { getProducts } from '../services/productService'
import { toast } from 'react-hot-toast'
import { useCallback, useState } from 'react'

export function useOrders(weekDataId: number | undefined) {
  const [isUpdating, setIsUpdating] = useState(false)

  const { data: orders, refetch, ...rest } = useSupabaseQuery(
    ['orders', weekDataId],
    async () => {
      if (!weekDataId) return []
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('week_data_id', weekDataId)
        .order('order_number')
      if (error) throw error
      return data as Order[]
    },
    {
      enabled: !!weekDataId,
      refetchInterval: isUpdating ? 1000 : false,
    }
  )

  const updateOrder = useCallback(async (order: Order) => {
    const { error } = await supabase
      .from('orders')
      .upsert(order)
      .eq('id', order.id)

    if (error) throw error
  }, [])

  const updateOrderStock = useCallback(async (
    orderId: number, 
    productId: number, 
    value: number | null
  ) => {
    try {
      setIsUpdating(true)
      const order = orders?.find((o) => o.id === orderId)
      if (!order) return
      
      const products = await getProducts()
      const product = products.find(p => p.id === productId)
      if (!product) return
      
      const updatedOrder = {
        ...order,
        real_stock: {
          ...order.real_stock,
        },
      }

      if (value === null) {
        // Remove real stock value to use theoretical
        delete updatedOrder.real_stock[productId]
      } else {
        // Convert and store real stock value
        const stockInUnits = convertToUnits(value, product)
        updatedOrder.real_stock[productId] = stockInUnits
      }

      await updateOrder(updatedOrder)
      await refetch()
      
      toast.success('Stock mis à jour')
    } catch (error) {
      console.error('Error updating stock:', error)
      toast.error('Erreur lors de la mise à jour du stock')
    } finally {
      setIsUpdating(false)
    }
  }, [orders, updateOrder, refetch])

  const updateOrderQuantity = useCallback(async (orderId: number, productId: number, value: number) => {
    try {
      setIsUpdating(true)
      const order = orders?.find((o) => o.id === orderId)
      if (!order) return

      const updatedOrder = {
        ...order,
        ordered_quantities: {
          ...order.ordered_quantities,
          [productId]: value,
        }
      }

      await updateOrder(updatedOrder)
      await refetch()
      
      toast.success('Quantité commandée mise à jour')
    } catch (error) {
      console.error('Error updating ordered quantity:', error)
      toast.error('Erreur lors de la mise à jour de la quantité')
    } finally {
      setIsUpdating(false)
    }
  }, [orders, updateOrder, refetch])

  return {
    orders,
    updateOrderStock,
    updateOrderQuantity,
    refetch,
    isUpdating,
    ...rest,
  }
}