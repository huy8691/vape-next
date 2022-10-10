export interface ProductDetailType {
  id: number
  name: string
  images?: Array<{ url: string }>
  retailPrice: number
  categories: Array<{ name: string }>
  description?: string
  rating?: number
  minQuantity?: number
  unit: number
  supplier: {
    name: string
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
