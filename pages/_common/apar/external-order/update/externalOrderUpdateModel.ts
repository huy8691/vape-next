export interface CreatePayloadType {
  code: string
  address: string
  address_name: string
  phone_number: string
  external_supplier: number
  items: Item[]
  tax_amount: string | number
  discount_amount: string | number
  order_date: string
  notes: string
}

export interface Item {
  product_variant?: number
  quantity: number
  price: number
}

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

export interface DetailAddressBookDataResponseType {
  success: string
  status: number
  message: string
  data: {
    name: string
    receiver_name: string
    phone_number: string
    address: string
    city: string
    state: string
    postal_zipcode: string
  }
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
