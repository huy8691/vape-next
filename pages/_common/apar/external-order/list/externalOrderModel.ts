export interface FormSearch {
  search?: string | string[]
}
export interface ExternalOrderListResponseType {
  success?: boolean
  statusCode?: number
  message?: string
  totalItems?: number
  nextPage?: null
  previousPage?: null
  currentPage?: number
  totalPages?: number
  limit?: number
  data: ExternalOrderTypeData[]
}

export interface ExternalOrderTypeData {
  id?: number
  code?: string
  status?: string
  orderDate?: Date
  payment_status?: string
  total_value?: number
  external_supplier?: string
}
