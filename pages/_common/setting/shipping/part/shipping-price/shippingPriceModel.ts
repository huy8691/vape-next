export interface RetailerDataType {
  business_id: number
  business_name: string

  owner_name: string
  federal_tax_id: string
  email: string
  phone_number: string
}

export interface RetailerDataResponseType {
  data: RetailerDataType[]
  totalPages?: number
  errors?: any
  totalItems: number
  currentPage: number
  previousPage: number | null
  nextPage: number | null
}
export interface ListValueFromAPIType {
  id: number
  name?: string
  first_name?: string
  last_name?: string
}
export interface ActionShippingFeeType {
  type: string
  ids: number[]
  enable: boolean
  amount?: number | null
}
export interface ListShippingFeeType {
  type: string
  ids: ListValueFromAPIType[]
  amount?: number | null
  enable: boolean
}

export interface ListShippingFeeResponseType {
  data: ListShippingFeeType[]
  errors?: any
}

export interface CustomerDetailType {
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

export interface ListCustomerResponseType {
  data: CustomerDetailType[]
  totalPages?: number
  errors?: any
  totalItems: number
  currentPage: number
  previousPage: number | null
  nextPage: number | null
}

export interface UpdateThresholdType {
  amount: number | null
  type: string
}
