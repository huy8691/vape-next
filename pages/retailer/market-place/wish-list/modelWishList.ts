export interface ProductDataType {
  id: number
  name: string
  thumbnail: string
  price: number
  unit: string
  is_favorite: boolean
  min_price?: number
  max_price?: number
  variant_count: number
  product_id: number
}

export interface ProductListDataResponseType {
  data?: ProductDataType[]
  totalPages?: number
  errors?: any
  currentPage?: number
  nextPage?: number | null
  totalItems?: number
}
