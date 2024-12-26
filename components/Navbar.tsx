import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { FiHome, FiBox, FiShoppingCart, FiMenu, FiX } from 'react-icons/fi'
import { MotionDiv } from './ui/motion'
import { cn } from '../utils/cn'

interface NavLinkProps {
  href: string
  icon: React.ReactNode
  text: string
  isActive: boolean
}

function NavLink({ href, icon, text, isActive }: NavLinkProps) {
  return (
    <Link 
      href={href}
      className={cn(
        "flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200",
        "hover:bg-bk-yellow/20 font-flame",
        isActive ? "bg-bk-yellow text-bk-brown" : "text-bk-brown hover:text-bk-brown"
      )}
    >
      <span className="text-xl">{icon}</span>
      <span className="font-medium">{text}</span>
    </Link>
  )
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()

  const navItems = [
    { href: '/', icon: <FiHome />, text: 'Accueil' },
    { href: '/products', icon: <FiBox />, text: 'Produits' },
    { href: '/orders', icon: <FiShoppingCart />, text: 'Commandes' }
  ]

  return (
    <nav className="sticky top-0 z-50 bg-bk-red border-b border-bk-yellow/20 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex-shrink-0 flex items-center">
            <Image 
              src="/images/logo.png" 
              alt="Burger King Logo" 
              width={48} 
              height={48}
              className="drop-shadow-md"
            />
            <h1 className="ml-3 text-xl font-flame font-bold text-bk-brown hidden sm:block">
              Gestion des Stocks
            </h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            {navItems.map((item) => (
              <NavLink
                key={item.href}
                href={item.href}
                icon={item.icon}
                text={item.text}
                isActive={router.pathname === item.href}
              />
            ))}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-bk-brown hover:bg-bk-yellow/20 transition-colors"
            >
              {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <MotionDiv
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="md:hidden"
        >
          <div className="px-2 pt-2 pb-3 space-y-1 bg-bk-red/95 backdrop-blur-sm border-t border-bk-yellow/10">
            {navItems.map((item) => (
              <NavLink
                key={item.href}
                href={item.href}
                icon={item.icon}
                text={item.text}
                isActive={router.pathname === item.href}
              />
            ))}
          </div>
        </MotionDiv>
      )}
    </nav>
  )
}