export interface WarehouseDetailType {
  name: string
  address: string | null
  description: string | null
  city: string
  postal_zipcode: string
  state: {
    name: string
    abbreviation: string
  }
}
export interface WarehouseSubmitType {
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
