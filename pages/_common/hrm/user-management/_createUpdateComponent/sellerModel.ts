export interface SellerDataType {
  email: string
  phone_number: string
  nick_name: string | null
  first_name: string
  last_name: string
  commission?: number | null
  dob?: string | null
  avatar?: string | null
  user_type: string
  roles: string[]
}
export interface CreateSellerDataType {
  email?: string
  phone_number: string
  first_name: string
  nick_name?: string | null
  commission?: number | null
  last_name: string
  user_type?: string
  roles: number[]
}

export interface SellerDataResponseType {
  data: SellerDataType[]
  error?: any
  totalPages?: number
}

export interface roleType {
  id: number
  name: string
  organization: string
  parent_role: string
  creator: string
}

export interface listRoleResponseType {
  data: roleType[]
  success?: boolean
  statusCode?: number
  message?: string
  totalItems?: number
  currentPage?: number
  nextPage?: number
  totalPages?: number
  limit?: number
}
