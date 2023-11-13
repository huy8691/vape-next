export interface WarehouseType {
  id: number
  name: string
  address: string
  is_active: boolean
  is_default: boolean
  city: string | null
  state: string | null
  postal_zipcode: string | null
}
export interface WarehouseResponseType {
  data: WarehouseType[]
  error: unknown
  totalPages: number
}
