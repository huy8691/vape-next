export interface ExternalOrderDetailResponseType {
  success?: boolean
  status?: number
  message?: string
  data?: ExternalOrderDetailTypeData
}

export interface ExternalOrderDetailTypeData {
  id?: number
  code?: string
  order_date?: Date
  status?: string
  payment_status?: string
  items?: Item[]
  sub_total?: number
  discount?: number
  tax_amount?: number
  total_value?: number
  address?: string
  address_name?: string
  phone_number?: string
  recipient_name?: string
  notes?: null
  supplier?: Supplier
}

export interface Item {
  order_items_id?: number
  id?: number
  product_id?: number
  is_active?: boolean
  have_variant?: boolean
  name?: string
  code?: string
  thumbnail?: null | string
  quantity?: number
  unit_price?: number
  unit_type?: string
  total?: number
  attribute_options?: any[]
}

export interface Supplier {
  id?: number
  email?: null
  phone_number?: null
  name?: string
  address?: null
  city?: null
  state?: null
  postal_zipcode?: null
}
