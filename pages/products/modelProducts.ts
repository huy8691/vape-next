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
