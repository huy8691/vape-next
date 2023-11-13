export interface ListOnlineCustomerType {
  id: number
  email: string
  phone_number: string
  bussiness_name: string
  first_name: string
  last_name: string
  address: string
  dob: string | null
  is_vip: boolean
  completed_orders: number
}

export interface ListOnlineCustomerResponseType {
  data: ListOnlineCustomerType[]
  errors?: any
  totalPages?: number
}
