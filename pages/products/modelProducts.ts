export interface ProductDataType {
  id: number
  name: string
  thumbnail: string
  price: number
  unit: string
}

export interface ProductListDataResponseType {
  data?: ProductDataType[]
  total?: number
  errors?: any
}
