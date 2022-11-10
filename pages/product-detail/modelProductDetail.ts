export interface ProductDetailType {
  id: number
  name: string
  brand: {
    name: string
    logo: string
  }
  manufacturer: {
    name: string
    logo: string
  }
  images?: Array<string>
  code: string
  description?: string
  longDescription?: string
  price?: number
  unit_types?: string
  inStock?: number
  is_favorite?: boolean
  category?: {
    id?: number
    name?: string
    parent_category?: {
      id?: number
      name?: string
    }
  }
}
export interface ProductDetailResponseType {
  data?: ProductDetailType
  errors?: any
}

// list product
export interface ProductDataType {
  id: number
  name: string
  thumbnail: string
  price: number
  unit: string
  code: string
  unit_types: string
}

export interface ProductListDataResponseType {
  data?: ProductDataType[]
  total?: number
  errors?: any
}

export interface WishListDataType {
  id: number
}
export interface WishListResponseType {
  data?: WishListDataType
  message?: string
  errors?: any
}
