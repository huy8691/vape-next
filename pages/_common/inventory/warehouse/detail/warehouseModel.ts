export interface WarehouseDetailType {
  name: string
  address: string | null
  description: string | null
  is_default: boolean
}

export interface WarehouseDetailResponseType {
  data?: WarehouseDetailType
  errors?: any
}
export interface ProductData {
  id: number
  name: string
  description: string
  longDescription: string
  price: number
  thumbnail: string
  code: string
  updated_at: string
  brand: {
    id: number
    name: string
    logo: string
  }
  category: {
    id: number
    name: string
    is_displayed: boolean
  }
  manufacturer: {
    id: number
    name: string
    logo: string
  }
  // brand: string
  // category: string
  // manufacturer: string
  stockAll: number
  unit_type: string
  is_active: boolean
  images: Array<string>
  variants_count: number
}
export interface ListProductDataType {
  data?: ProductData[]
  totalPages?: number
  errors?: any
  totalItems: number
  currentPage: number
  previousPage: number | null
  nextPage: number | null
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

// brand
export interface ProductBrandType {
  id: number
  name: string
  logo: string | null
}
export interface ProductBrandResponseType {
  data: ProductBrandType[]
  totalPages?: number
  errors?: any
  currentPage?: number
  nextPage?: number | null
  totalItems?: number
}

// manufacturer
export interface ProductManufacturerType {
  id: number
  name: string
  logo: string
}

export interface ProductManufacturerResponseType {
  data: ProductManufacturerType[]
  totalPages?: number
  errors?: any
  currentPage?: number
  nextPage?: number | null
  totalItems?: number
}
export interface FilterType {
  category: number[]
  brand: number[]
  manufacturer: number[]
  instock_gte: number
  instock_lte: number
  price_lte: number
  price_gte: number
}
