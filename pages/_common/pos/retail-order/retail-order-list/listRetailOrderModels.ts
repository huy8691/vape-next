export interface RetailOrderDataType {
  id: number
  code: number
  status: string
  orderDate: string
  payment_status: string
  payment_method: {
    id: number
    name: string
  }
  total_value: number
  total_billing: number
}
export interface RetailOrderDataResponseType {
  data: RetailOrderDataType[]
  totalPages?: number
  totalItems: number
  errors?: any
  currentPage: number
  previousPage: number | null
  nextPage: number | null
}
