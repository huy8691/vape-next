export interface ProductDataType {
  id: number
  name: string
  thumbnail: string
  min_price: number
  max_price: number
  unit: string
  is_favorite: boolean
  price_discount?: number | null
}

export interface ProductListDataResponseType {
  data?: ProductDataType[]
  totalPages?: number
  errors?: any
  currentPage?: number
  nextPage?: number | null
  totalItems?: number
}

// category
export interface ProductCategoryType {
  id: number
  name: string
  organization_info: {
    id: number
    name: string
  }
  child_category: ProductCategoryType[]
  parent_category?: {
    id: number
    name: string
    organization_info: {
      id: number
      name: string
    }
  }
  thumbnail: string
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
  logo: string
  organization_info: {
    id: number
    name: string
  }
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
  organization_info: {
    id: number
    name: string
  }
}

export interface ProductManufacturerResponseType {
  data: ProductManufacturerType[]
  totalPages?: number
  errors?: any
  currentPage?: number
  nextPage?: number | null
  totalItems?: number
}

export interface SupplierType {
  id: number
  name: string
  is_manufacturer: boolean
}
export interface SupplierResponseType {
  data?: SupplierType[]
  totalPages?: number
  errors?: any
}
