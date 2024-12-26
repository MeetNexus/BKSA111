import { InputHTMLAttributes } from 'react'
import { cn } from '../../utils/cn'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export default function Input({ label, error, className = '', ...props }: InputProps) {
  return (
    <div className="flex flex-col">
      {label && (
        <label className="mb-1 text-xs lg:text-sm font-medium text-gray-700">{label}</label>
      )}
      <input
        className={cn(
          'px-2 py-1 border border-gray-300 rounded-md text-xs lg:text-sm',
          'focus:outline-none focus:ring-1 focus:ring-bk-yellow focus:border-bk-yellow',
          'transition-all duration-200',
          'placeholder:text-gray-400 placeholder:text-xs lg:placeholder:text-sm',
          className
        )}
        {...props}
      />
      {error && <span className="mt-1 text-xs text-red-500">{error}</span>}
    </div>
  )
}