export interface MerchantDataType {
  business_id: number
  business_name: string
  federal_tax_id: string
  owner_name: string
  phone_number: string
  email: string
  assignee: ListSellerDataType[]
}

export interface MerchantDataResponseType {
  data: MerchantDataType[]
  totalPages?: number
  errors?: any
  totalItems: number
  currentPage: number
  previousPage: number | null
  nextPage: number | null
}

export interface SellerDataType {
  id: number
  avatar?: string
  first_name: string
  last_name: string
}

export interface AssignSellerDataType {
  sellers: number[]
}

export interface SellerDataResponseType {
  data: SellerDataType[]
  error?: unknown
  totalPages?: number
}

export interface ListSellerDataType {
  id: number
  first_name: string
  last_name: string
  avatar?: string
}
export interface ListSellerDataResponseType {
  data: ListSellerDataType[]
  error?: unknown
  totalPages?: number
  nextPage?: number
  previousPage?: number
  currentPage?: number
  limit?: number
}
