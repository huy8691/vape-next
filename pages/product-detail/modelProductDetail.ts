export interface ProductDetailType {
  id: number
  name: string
  images?: Array<string>
  code: string
  description?: string
  longDescription?: string
  price?: number
  unit_types?: string
  inStock?: number
}

export interface ProductDetailResponseType {
  data?: ProductDetailType
  errors?: any
}

// list product
export interface ProductDataType {
  id: number
  name: string
  thumbnails: Array<{ url: string }>
  prices: Array<{ price: number }>
  unit: string
}

export interface ProductListDataResponseType {
  data?: ProductDataType[]
  total?: number
  errors?: any
}

// list comment
export interface CommentDataType {
  id: number
  comment: string
  customer: {
    avatar: string
    fullName: string
  }
  rating: number
  created_at: string
}

export interface CommentListDataResponseType {
  data?: CommentDataType[]
  total?: number
  errors?: any
}
