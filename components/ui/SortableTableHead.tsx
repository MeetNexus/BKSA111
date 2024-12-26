import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/outline'
import { TableHead } from './Table'
import { SortConfig } from '../../hooks/useSorting'
import { cn } from '../../utils/cn'

interface SortableTableHeadProps {
  label: string
  sortKey: string
  sortConfig?: SortConfig
  onSort: (key: string) => void
  className?: string
}

export default function SortableTableHead({
  label,
  sortKey,
  sortConfig,
  onSort,
  className = ''
}: SortableTableHeadProps) {
  const isSorted = sortConfig?.key === sortKey
  const isAsc = isSorted && sortConfig?.direction === 'asc'

  return (
    <TableHead className={className}>
      <button
        onClick={() => onSort(sortKey)}
        className={cn(
          'w-full text-left flex items-center justify-between space-x-2',
          'cursor-pointer select-none group hover:bg-gray-50/50',
          'transition-colors duration-200 px-2 py-1 rounded'
        )}
      >
        <span>{label}</span>
        <div className={cn(
          'flex flex-col transition-opacity duration-200',
          isSorted ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'
        )}>
          <ChevronUpIcon 
            className={cn(
              'h-3 w-3 transition-colors duration-200',
              isSorted && isAsc ? 'text-bk-brown' : 'text-gray-300 group-hover:text-gray-400'
            )}
          />
          <ChevronDownIcon 
            className={cn(
              'h-3 w-3 -mt-1 transition-colors duration-200',
              isSorted && !isAsc ? 'text-bk-brown' : 'text-gray-300 group-hover:text-gray-400'
            )}
          />
        </div>
      </button>
    </TableHead>
  )
}