export interface SellerDataType {
  first_name?: string
  last_name?: string
  phone_number?: string
  roles?: Role[]
  commission?: number
  nick_name?: null
  avatar?: null
  email?: string
  dob?: null
  status?: string
  user_type?: string
  income?: Income
}

export interface Income {
  id?: number
  type?: string
  pay_rate?: number
}

export interface Role {
  id?: number
  name?: string
  parent_role_id?: number
  organization_id?: number
  created_by?: number
  path?: string
}

export interface Item {
  id?: number
  from_time?: string
  to_time?: string
  enable?: boolean
}
