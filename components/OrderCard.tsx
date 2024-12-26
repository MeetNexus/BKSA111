import { ReactNode, useMemo } from 'react'
import { Order, Product, Category, WeekData } from '../types/interfaces'
import { Table, TableHeader, TableBody, TableHead, TableRow } from './ui/Table'
import CategoryGroup from './CategoryGroup'
import { Card, CardHeader } from './ui/Card'
import { Badge } from './ui/Badge'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import SortableTableHead from './ui/SortableTableHead'
import { useSorting } from '../hooks/useSorting'
import { useOrderCalculations } from '../hooks/useOrderCalculations'

interface OrderCardProps {
  order: Order
  products: Product[]
  categories: Category[]
  hiddenProducts: number[]
  weekData: WeekData
  previousOrders: Order[]
  previousWeekOrders: Order[]
  onStockChange: (orderId: number, productId: number, value: number | null) => void
  onOrderedQuantityChange: (orderId: number, productId: number, value: number) => void
  onToggleProductVisibility: (productId: number) => void
}

export default function OrderCard({
  order,
  products,
  categories,
  hiddenProducts,
  weekData,
  previousOrders,
  previousWeekOrders,
  onStockChange,
  onOrderedQuantityChange,
  onToggleProductVisibility,
}: OrderCardProps) {
  const { needs, theoreticalStock } = useOrderCalculations(
    order,
    weekData,
    products,
    previousOrders,
    previousWeekOrders
  )

  const productsWithNeeds = useMemo(() => 
    products.map(product => ({
      ...product,
      need: needs[product.id!] || 0
    })),
    [products, needs]
  )

  const deliveryDate = new Date(order.delivery_date)
  const isToday = new Date().toDateString() === deliveryDate.toDateString()
  const isPast = deliveryDate < new Date()

  return (
    <div className="space-y-4">
      <Card variant="colored" hover={true}>
        <CardHeader className="border-b border-bk-yellow/20 bg-bk-red">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-flame font-bold text-bk-brown">
              Commande {order.order_number}
            </h2>
            <Badge variant={isToday ? 'default' : isPast ? 'secondary' : 'outline'}>
              {format(deliveryDate, 'EEEE d MMMM', { locale: fr })}
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {categories.map((category) => {
        const categoryProducts = productsWithNeeds.filter(p => p.category_id === category.id)
        if (categoryProducts.length === 0) return null

        const { sortedItems: sortedProducts, sortConfig, requestSort } = useSorting(
          categoryProducts,
          { key: 'nom_produit', direction: 'asc' }
        )

        return (
          <Card key={category.id} variant="default" className="overflow-hidden">
            <CardHeader className="bg-bk-yellow/5 py-3">
              <h3 className="text-lg font-flame font-medium text-bk-brown">
                {category.name}
              </h3>
            </CardHeader>
            <div className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <SortableTableHead
                      label="Produit"
                      sortKey="nom_produit"
                      sortConfig={sortConfig}
                      onSort={requestSort}
                      className="w-[40%]"
                    />
                    <SortableTableHead
                      label="Stock"
                      sortKey="stock"
                      sortConfig={sortConfig}
                      onSort={requestSort}
                      className="w-[20%] text-center"
                    />
                    <SortableTableHead
                      label="Besoin"
                      sortKey="need"
                      sortConfig={sortConfig}
                      onSort={requestSort}
                      className="w-[20%] text-center"
                    />
                    <SortableTableHead
                      label="Quantité"
                      sortKey="ordered"
                      sortConfig={sortConfig}
                      onSort={requestSort}
                      className="w-[20%] text-center"
                    />
                    <TableHead className="w-8"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <CategoryGroup
                    category={category}
                    products={sortedProducts || []}
                    hiddenProducts={hiddenProducts}
                    realStock={order.real_stock || {}}
                    theoreticalStock={theoreticalStock}
                    orderedQuantities={order.ordered_quantities || {}}
                    onStockChange={(productId, value) => 
                      onStockChange(order.id!, productId, value)
                    }
                    onOrderedQuantityChange={(productId, value) =>
                      onOrderedQuantityChange(order.id!, productId, value)
                    }
                    onToggleProductVisibility={onToggleProductVisibility}
                  />
                </TableBody>
              </Table>
            </div>
          </Card>
        )
      })}
    </div>
  )
}