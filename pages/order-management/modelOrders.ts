export interface OrderDataType {
  id: number
  code: string
  status: string
  orderDate: string
  payment_status: string
  total_value: number
  receiver: string
  address: string
}

export interface OrderListDataResponseType {
  data: OrderDataType[]
  totalPages?: number
  totalItems: number
  errors?: any
  currentPage: number
  previousPage: number | null
  nextPage: number | null
}
