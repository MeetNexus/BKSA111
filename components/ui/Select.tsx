import { SelectHTMLAttributes } from 'react'

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  options: Array<{ value: string | number; label: string; disabled?: boolean }>
  error?: string
}

export default function Select({ label, options, error, className = '', ...props }: SelectProps) {
  return (
    <div className="flex flex-col">
      {label && (
        <label className="mb-1 text-sm font-medium text-gray-700">{label}</label>
      )}
      <select
        className={`px-3 py-2 border border-gray-300 rounded-md text-sm
          focus:outline-none focus:ring-2 focus:ring-bk-yellow focus:border-transparent
          disabled:bg-gray-100 disabled:cursor-not-allowed
          ${className}`}
        {...props}
      >
        {options.map(({ value, label, disabled }) => (
          <option
            key={value}
            value={value}
            disabled={disabled}
          >
            {label}
          </option>
        ))}
      </select>
      {error && <span className="mt-1 text-xs text-red-500">{error}</span>}
    </div>
  )
}