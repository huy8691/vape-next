export interface AddressDataType {
  id: number
  name: string
  phone_number: string
  receiver_name: string
  address: string
  default_address: boolean
  city: string
  state: string
  postal_zipcode: string
}

export interface AddressDataResponsiveType {
  data: {
    id: number
    name: string
    phone_number: string
    receiver_name: string
    address: string
    default_address: boolean
    city: string
    state: string
    postal_zipcode: string
  }[]
  totalPages?: number
  errors?: any
  totalItems?: number
  currentPage?: number
  previousPage: number | null
  nextPage: number | null
}
