export interface ListProductDataType {
  data: ProductData[]
  totalPages?: number
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
  brand: number
  category: string
  manufacturer: number
  unit_types: string
  is_active: boolean
  images: Array<string>
}
