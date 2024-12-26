export interface Database {
  public: {
    Tables: {
      products: {
        Row: ProductConstants
        Insert: ProductConstants
        Update: Partial<ProductConstants>
      }
      weeks_data: {
        Row: WeeklyVariableData
        Insert: WeeklyVariableData
        Update: Partial<WeeklyVariableData>
      }
      orders: {
        Row: OrderData
        Insert: OrderData
        Update: Partial<OrderData>
      }
    }
  }
}

export interface ProductConstants {
  id?: number
  reference_produit: string
  nom_produit: string
  code_destination: string
  unite_stock: string
  is_hidden: boolean
  unit_conversion?: {
    number_of_packs: number
    units_per_pack: number
    unit: string
  }
}

export interface WeeklyVariableData {
  id?: number
  year: number
  week_number: number
  consumption_data?: { [reference_produit: string]: number }
  sales_forecast?: { [date: string]: number }
}

export interface OrderData {
  id?: number
  week_data_id: number
  order_number: number
  delivery_date: string
  real_stock?: { [productId: number]: number }
  needs?: { [productId: number]: number }
  ordered_quantities?: { [productId: number]: number }
}