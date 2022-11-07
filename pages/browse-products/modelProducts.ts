export interface ProductDataType {
  id: number
  name: string
  thumbnail: string
  price: number
  unit: string
}

export interface ProductListDataResponseType {
  data?: ProductDataType[]
  totalPages?: number
  errors?: any
}

// category
export interface ProductCategoryType {
  id: number
  name: string
  is_displayed: boolean
  checked?: boolean
  indeterminate?: boolean
  child_category: ProductCategoryType[]
  parent_category: ProductCategoryType[]
}

export interface ProductCategoryResponseType {
  data?: ProductCategoryType[]
  totalPages?: number
  errors?: any
}

// brand
export interface ProductBrandType {
  id: number
  name: string
  logo: string
  checked?: boolean
}

export interface ProductBrandResponseType {
  data?: ProductBrandType[]
  totalPages?: number
  errors?: any
}

// manufacturer
export interface ProductManufacturerType {
  id: number
  name: string
  logo: string
  checked?: boolean
}

export interface ProductManufacturerResponseType {
  data?: ProductBrandType[]
  totalPages?: number
  errors?: any
}
