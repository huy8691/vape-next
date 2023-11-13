export interface SellerDataType {
  email: string
  phone_number: string
  first_name: string
  last_name: string
  nick_name: string | null
  user_type: string
  dob?: string | null
  avatar?: string | null
  roles: number
}
export interface CreateSellerDataType {
  email?: string
  phone_number: string
  first_name: string
  last_name: string
  nick_name: string | null
  dob?: string | null
  avatar?: string | null
  user_type?: string
  roles: number
}

export interface SellerDataResponseType {
  data: SellerDataType[]
  error?: any
  totalPages?: number
}
