export interface UpdateSellerDataType {
  phone_number: string
  first_name: string
  last_name: string
  nick_name: string | null
  dob?: string | null
  avatar?: string | null
}
export interface SellerDataType {
  phone_number: string
  first_name: string
  last_name: string
  nick_name: string | null
  dob?: string | null
  avatar?: string | null
  data?: any
}

export interface SellerDataResponseType {
  data: UpdateSellerDataType[]
  error?: any
  totalPages?: number
}
