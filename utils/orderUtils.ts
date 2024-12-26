import { Order, WeekData, Product } from '../types/interfaces'
import { calculateOrderNeeds } from './calculations'

export function calculateAllOrderNeeds(
  orders: Order[],
  weekData: WeekData,
  products: Product[],
  previousWeekOrders: Order[] = []
): { [orderId: number]: { [productId: number]: number } } {
  const needs: { [orderId: number]: { [productId: number]: number } } = {}

  // Sort orders by order number to ensure sequential calculation
  const sortedOrders = [...orders].sort((a, b) => a.order_number - b.order_number)

  sortedOrders.forEach(order => {
    needs[order.id!] = {}
    
    // Get previous orders for this calculation
    const previousOrders = sortedOrders.filter(o => o.order_number < order.order_number)

    products.forEach(product => {
      const need = calculateOrderNeeds(
        order,
        weekData,
        product,
        previousOrders,
        previousWeekOrders
      )
      needs[order.id!][product.id!] = need
    })
  })

  return needs
}

export function filterProducts(
  products: Product[],
  searchTerm: string,
  hiddenProducts: number[]
): Product[] {
  return products.filter(
    (product) =>
      !hiddenProducts.includes(product.id!) &&
      !product.is_hidden &&
      (product.nom_produit.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.reference_produit.toLowerCase().includes(searchTerm.toLowerCase()))
  )
}

export function updateOrderNeeds(
  orders: Order[],
  weekData: WeekData,
  products: Product[],
  previousWeekOrders: Order[]
): Order[] {
  const needs = calculateAllOrderNeeds(orders, weekData, products, previousWeekOrders)
  
  return orders.map(order => ({
    ...order,
    needs: needs[order.id!]
  }))
}