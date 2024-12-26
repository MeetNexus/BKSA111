import { ReactNode } from 'react'
import { cn } from '../../utils/cn'

interface TableProps {
  children: ReactNode
  className?: string
}

export function Table({ children, className }: TableProps) {
  return (
    <div className="w-full">
      <table className={cn('w-full table-fixed caption-bottom text-sm', className)}>
        {children}
      </table>
    </div>
  )
}

export function TableHeader({ children, className }: TableProps) {
  return (
    <thead className={cn('[&_tr]:border-b bg-bk-red/50', className)}>
      {children}
    </thead>
  )
}

export function TableBody({ children, className }: TableProps) {
  return <tbody className={cn('[&_tr:last-child]:border-0', className)}>{children}</tbody>
}

export function TableRow({ children, className }: TableProps) {
  return (
    <tr className={cn(
      'border-b transition-colors hover:bg-gray-50/50 data-[state=selected]:bg-gray-50',
      className
    )}>
      {children}
    </tr>
  )
}

export function TableHead({ children, className }: TableProps) {
  return (
    <th className={cn(
      'h-12 px-4 text-left align-middle font-medium text-bk-brown',
      '[&:has([role=checkbox])]:pr-0',
      className
    )}>
      {children}
    </th>
  )
}

export function TableCell({ children, className }: TableProps) {
  return (
    <td className={cn(
      'p-4 align-middle [&:has([role=checkbox])]:pr-0',
      className
    )}>
      {children}
    </td>
  )
}