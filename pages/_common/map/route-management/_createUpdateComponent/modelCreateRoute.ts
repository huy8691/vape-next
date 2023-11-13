export interface SellerDataType {
  id: number
  email: string
  full_name: string
  status: string
  user_type: string
  created_at: string
}

export interface SellerDataResponseType {
  data: SellerDataType[]
  error?: unknown
  totalPages?: number
}

export interface ContactDataType {
  id: number
  first_name: string
  last_name: string
  business_name: string
  phone_number: string
  federal_tax_id?: string
  address: string
}

export interface ContactDataResponseType {
  data: ContactDataType[]
  error?: unknown
  totalPages?: number
}
export interface FormRouterType {
  seller_id: number
  name: string
  date_from: string
  origin: {
    address: string
    latitude: string
    longitude: string
  }
  destination: {
    address: string
    latitude: string
    longitude: string
  }
  optimize: boolean
  locations: {
    address: string
    latitude: string
    longitude: string
    contact: {
      business_name: string
      id: number | null
    } | null
  }[]
}
