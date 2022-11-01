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
  parent_category: object
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
}

export interface ProductBrandResponseType {
  data?: ProductBrandType[]
  totalPages?: number
  errors?: any
}
