export interface OrderMerchantDataType {
  id: number
  code: string
  order_number: string
  order_date: string
  total_billing: number
  status: string
  payment_status: string
}

export interface OrderMerchantDataResponseType {
  data: OrderMerchantDataType[]
  totalPages?: number
  errors?: any
  totalItems: number
  currentPage: number
  limit: number
  previousPage: number | null
  nextPage: number | null
}
