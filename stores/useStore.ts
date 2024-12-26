// stores/useStore.ts

import create from 'zustand'
import { Product, Category, WeekData, Order } from '../types/interfaces'

// Importer les services appropriés
import { getProducts } from '../services/productService'
import { getCategories } from '../services/categoryService'
import { getWeekData } from '../services/weekService'
import { getOrdersForWeek } from '../services/orderService'

interface StoreState {
  products: Product[]
  categories: Category[]
  weekData: WeekData | null
  orders: Order[]
  fetchProducts: () => Promise<void>
  fetchCategories: () => Promise<void>
  fetchWeekData: (year: number, weekNumber: number) => Promise<void>
  fetchOrders: (weekDataId: number) => Promise<void>
  setProducts: (products: Product[]) => void
  setCategories: (categories: Category[]) => void
  setWeekData: (weekData: WeekData | null) => void
  setOrders: (orders: Order[]) => void
}

export const useStore = create<StoreState>((set) => ({
  products: [],
  categories: [],
  weekData: null,
  orders: [],
  fetchProducts: async () => {
    try {
      const products = await getProducts()
      set({ products })
    } catch (error) {
      console.error('Erreur lors du chargement des produits :', error)
    }
  },
  fetchCategories: async () => {
    try {
      const categories = await getCategories()
      set({ categories })
    } catch (error) {
      console.error('Erreur lors du chargement des catégories :', error)
    }
  },
  fetchWeekData: async (year, weekNumber) => {
    try {
      const weekData = await getWeekData(year, weekNumber)
      set({ weekData })
    } catch (error) {
      console.error('Erreur lors du chargement des données de la semaine :', error)
    }
  },
  fetchOrders: async (weekDataId) => {
    try {
      const orders = await getOrdersForWeek(weekDataId)
      set({ orders })
    } catch (error) {
      console.error('Erreur lors du chargement des commandes :', error)
    }
  },
  setProducts: (products) => set({ products }),
  setCategories: (categories) => set({ categories }),
  setWeekData: (weekData) => set({ weekData }),
  setOrders: (orders) => set({ orders }),
}))
