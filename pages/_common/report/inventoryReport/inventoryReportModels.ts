export interface ProductDetailType {
  id: number
  name: string
  thumbnail: string
  stock: string
  low_stock_alert: string
  unit: string
  is_own?: boolean
  dc_id: number
}
export interface ProductListResponseType {
  data: ProductDetailType[]
}

export interface InventorySummaryRetailType {
  total_products?: number
  existing_products?: number
  purchased_products?: number
  low_stock_products?: number
}

export interface InventorySummaryResponseRetailType {
  data: InventorySummaryRetailType
  errors?: any
}

export interface InventoryWarehousesType {
  id: number
  name: string
  total_products: number
}

export interface InventoryWarehousesResponseType {
  data: InventoryWarehousesType[]
  errors?: any
}
export interface InventoryCategoryResponseType {
  data: InventoryCategoryType[]
  errors?: any
}
export interface InventoryCategoryType {
  id: number
  name: string
  total_product: number
}
export interface DataForPieChartType {
  name: string
  percentage: number
}
export interface InventoryProductConsumptionsType {
  product_name: string
  product_code: string
  product_thumbnail: string
  from_stock: string
  to_stock: string
  quantity_used: number
  unit: string
  base_price: number
  total: number
  time: string
}
export interface InventoryProductConsumptionsResponseType {
  data: InventoryProductConsumptionsType[]
  errors?: any
}

export interface InventoryProductConsumptionFilterType {
  fromDate: Date
  toDate: Date
  type: string
}

export interface ListEnumForConsumptionType {
  key: string
  values: number
}

export interface ListEnumForConsumptionResponseType {
  data: ListEnumForConsumptionType[]
  errors?: any
}
