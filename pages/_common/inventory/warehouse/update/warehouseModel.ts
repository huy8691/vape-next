export interface WarehouseDetailType {
  name: string
  address: string | null
  description: string | null
  city: string
  postal_zipcode: string
  state: string
}

export interface WarehouseDetailResponseType {
  data?: WarehouseDetailType
  errors?: any
}
