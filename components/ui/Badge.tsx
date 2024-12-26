import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../utils/cn'

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'bg-bk-yellow text-bk-brown hover:bg-bk-yellow/80',
        secondary: 'bg-bk-red text-bk-brown hover:bg-bk-red/80',
        outline: 'text-bk-brown border border-bk-yellow'
      }
    },
    defaultVariants: {
      variant: 'default'
    }
  }
)

interface BadgeProps extends VariantProps<typeof badgeVariants> {
  className?: string
  children: React.ReactNode
}

export function Badge({ className, variant, children }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)}>
      {children}
    </div>
  )
}