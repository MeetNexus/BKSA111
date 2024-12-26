import { useState, useRef, useEffect } from 'react'
import { Order, Product, Category, WeekData } from '../types/interfaces'
import OrderCard from './OrderCard'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/outline'
import Button from './ui/Button'
import { Card } from './ui/Card'

interface OrderCarouselProps {
  orders: Order[]
  products: Product[]
  categories: Category[]
  hiddenProducts: number[]
  weekData: WeekData
  previousWeekOrders: Order[]
  onStockChange: (orderId: number, productId: number, value: number) => void
  onOrderedQuantityChange: (orderId: number, productId: number, value: number) => void
  onToggleProductVisibility: (productId: number) => void
}

export default function OrderCarousel({
  orders,
  products,
  categories,
  hiddenProducts,
  weekData,
  previousWeekOrders,
  onStockChange,
  onOrderedQuantityChange,
  onToggleProductVisibility,
}: OrderCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isAnimating, setIsAnimating] = useState(false)

  const minSwipeDistance = 50

  useEffect(() => {
    const checkWidth = () => {
      setIsMobile(window.innerWidth < 1280)
    }
    checkWidth()
    window.addEventListener('resize', checkWidth)
    return () => window.removeEventListener('resize', checkWidth)
  }, [])

  const sortedOrders = [...orders].sort((a, b) => a.order_number - b.order_number)

  const handlePrev = () => {
    if (isAnimating) return
    setIsAnimating(true)
    setCurrentIndex((prev) => Math.max(0, prev - 1))
    setTimeout(() => setIsAnimating(false), 300)
  }

  const handleNext = () => {
    if (isAnimating) return
    setIsAnimating(true)
    setCurrentIndex((prev) => Math.min(sortedOrders.length - 1, prev + 1))
    setTimeout(() => setIsAnimating(false), 300)
  }

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance

    if (isLeftSwipe && currentIndex < sortedOrders.length - 1) {
      handleNext()
    }

    if (isRightSwipe && currentIndex > 0) {
      handlePrev()
    }
  }

  return (
    <div className="relative">
      <div 
        className="overflow-hidden"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <div
          ref={containerRef}
          className={`${
            isMobile
              ? 'flex transition-transform duration-300 ease-in-out'
              : 'grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6'
          }`}
          style={
            isMobile
              ? {
                  transform: `translateX(-${currentIndex * 100}%)`,
                }
              : undefined
          }
        >
          {sortedOrders.map((order) => {
            const previousOrders = sortedOrders.filter(o => o.order_number < order.order_number)
            
            return (
              <div
                key={order.id}
                className={`${
                  isMobile 
                    ? 'w-full flex-shrink-0 px-2 first:pl-4 last:pr-4' 
                    : ''
                }`}
              >
                <OrderCard
                  order={order}
                  products={products}
                  categories={categories}
                  hiddenProducts={hiddenProducts}
                  weekData={weekData}
                  previousOrders={previousOrders}
                  previousWeekOrders={previousWeekOrders}
                  onStockChange={onStockChange}
                  onOrderedQuantityChange={onOrderedQuantityChange}
                  onToggleProductVisibility={onToggleProductVisibility}
                />
              </div>
            )
          })}
        </div>
      </div>

      {isMobile && (
        <Card className="fixed bottom-4 left-4 right-4 z-50 bg-white/90 backdrop-blur-sm shadow-lg">
          <div className="flex items-center justify-between p-4">
            <Button
              onClick={handlePrev}
              disabled={currentIndex === 0 || isAnimating}
              variant="secondary"
              size="sm"
              className="rounded-full w-10 h-10 flex items-center justify-center"
            >
              <ChevronLeftIcon className="h-5 w-5" />
            </Button>

            <div className="flex items-center space-x-2">
              {sortedOrders.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    if (!isAnimating) {
                      setIsAnimating(true)
                      setCurrentIndex(index)
                      setTimeout(() => setIsAnimating(false), 300)
                    }
                  }}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                    index === currentIndex 
                      ? 'bg-bk-yellow scale-125' 
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>

            <Button
              onClick={handleNext}
              disabled={currentIndex === sortedOrders.length - 1 || isAnimating}
              variant="secondary"
              size="sm"
              className="rounded-full w-10 h-10 flex items-center justify-center"
            >
              <ChevronRightIcon className="h-5 w-5" />
            </Button>
          </div>
        </Card>
      )}
    </div>
  )
}