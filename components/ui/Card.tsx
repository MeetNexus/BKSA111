import { ReactNode } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../utils/cn'

const cardVariants = cva(
  'rounded-lg shadow-sm transition-all duration-200',
  {
    variants: {
      variant: {
        default: 'bg-white border border-gray-200',
        colored: 'bg-bk-red border border-bk-yellow/20',
        glass: 'bg-white/80 backdrop-blur-sm border border-gray-200/50'
      },
      hover: {
        true: 'hover:shadow-md hover:-translate-y-0.5',
        false: ''
      }
    },
    defaultVariants: {
      variant: 'default',
      hover: false
    }
  }
)

interface CardProps extends VariantProps<typeof cardVariants> {
  children: ReactNode
  className?: string
}

export function Card({ children, variant, hover, className }: CardProps) {
  return (
    <div className={cn(cardVariants({ variant, hover }), className)}>
      {children}
    </div>
  )
}

export function CardHeader({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn('px-6 py-4 border-b border-gray-200', className)}>
      {children}
    </div>
  )
}

export function CardContent({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn('px-6 py-4', className)}>
      {children}
    </div>
  )
}

export function CardFooter({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn('px-6 py-4 border-t border-gray-200', className)}>
      {children}
    </div>
  )
}