export interface ProductType {
  id: number
  name: string
  warehouses: Warehouse[]
}

export interface Warehouse {
  id: number
  name: string
  quantity?: number
}

export interface TableType {
  name: string
  price: string
  quantity: number
  products: ProductType[]
}

export interface WarehouseProductType {
  quantity: number
  warehouse: number
}

export interface FormType {
  name?: string
  brand?: string | null
  category?: string | null
  unit_type?: string
  price: number
  product_variant: number | null
  quantity: number
  base_price: number
  products: WarehouseProductType[]
}

export interface ProductCategoryType {
  id: number
  name: string
  child_category: ProductCategoryType[]
  parent_category: ProductCategoryType
}

export interface ProductCategoryResponseType {
  data: ProductCategoryType[]
  totalPages?: number
  errors?: any
  currentPage?: number
  nextPage?: number | null
  totalItems?: number
}
