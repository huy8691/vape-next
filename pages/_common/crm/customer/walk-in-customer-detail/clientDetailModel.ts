export interface ClientDetailType {
  id: number
  email: string
  first_name: string
  last_name: string
  phone_number: string
  business_name: string
  address: string
  total_paid_amount: number
  is_vip: boolean
}

export interface ClientDetailResponseType {
  data: ClientDetailType
  errors?: any
}
export interface PaymentMethodType {
  id: number
  name: string
}
export interface OrderHistoryByClient {
  id: number
  code: string
  created_at: string
  updated_at: string
  payment_status: string
  total_billing: number
  payment_method: PaymentMethodType
}

export interface OrderHistoryByClientResponseType {
  data: OrderHistoryByClient[]
  errors?: any
  totalItems: number
  nextPage: number | null
  previousPage: number | null
  totalPages: number
}

export interface SetVipType {
  is_vip: boolean
}
