export interface ProductDetailType {
  id: number
  name: string
  code: string
  instock: number
  min_price: number
  max_price: number
  variants_count: number
  thumbnail: string
  unit_type: string
  is_favorite: boolean
}

export interface ProductDetailResponseType {
  data: ProductDetailType[]
  errors?: any
  totalPages: number
  totalItems: number
}
