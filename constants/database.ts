export const DATABASE_TABLES = {
  PRODUCTS: 'products',
  WEEKS_DATA: 'weeks_data',
  ORDERS: 'orders'
} as const

export const PRODUCT_FIELDS = {
  REFERENCE: 'reference_produit',
  NAME: 'nom_produit',
  DESTINATION_CODE: 'code_destination',
  STOCK_UNIT: 'unite_stock',
  IS_HIDDEN: 'is_hidden',
  UNIT_CONVERSION: 'unit_conversion'
} as const

export const WEEK_DATA_FIELDS = {
  YEAR: 'year',
  WEEK_NUMBER: 'week_number',
  CONSUMPTION_DATA: 'consumption_data',
  SALES_FORECAST: 'sales_forecast'
} as const

export const ORDER_FIELDS = {
  WEEK_DATA_ID: 'week_data_id',
  ORDER_NUMBER: 'order_number',
  DELIVERY_DATE: 'delivery_date',
  REAL_STOCK: 'real_stock',
  NEEDS: 'needs',
  ORDERED_QUANTITIES: 'ordered_quantities'
} as const