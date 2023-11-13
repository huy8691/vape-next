export interface FormSearch {
  search?: string | string[]
}
export interface ExternalSupplierListResponseType {
  success?: boolean
  statusCode?: number
  message?: string
  totalItems?: number
  nextPage?: null
  previousPage?: null
  currentPage?: number
  totalPages?: number
  limit?: number
  data: ExternalSupplierTypeData[]
}

export interface ExternalSupplierTypeData {
  id?: number
  name?: string
  email?: string
  phone_number?: string
  address?: string
  city?: string
  state?: string
  postal_zipcode?: string
  organization?: number
}
