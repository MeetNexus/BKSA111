import { ReactNode } from 'react'

interface ButtonProps {
  children: ReactNode
  onClick?: () => void
  className?: string
}

export default function Button({ children, onClick, className }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center px-4 py-2 bg-bk-yellow text-bk-brown rounded hover:bg-bk-red hover:text-bk-white transition-colors ${className}`}
    >
      {children}
    </button>
  )
}
