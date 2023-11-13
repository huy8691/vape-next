export interface VoucherDetailDataType {
  success?: boolean
  status?: number
  message?: string
  data?: VoucherDetail
}

export interface VoucherDetail {
  id?: number
  title?: string
  code?: string
  type?: string
  discount_amount?: number
  max_discount_amount?: number
  minimum_spend?: number
  start_date?: string
  expiry_date?: string
  limit_per_voucher?: number
  limit_per_user?: number
  product_coverage?: string
  status?: string
  availability?: string[]
}

export interface OnlineOrderDataType {
  success?: boolean
  statusCode?: number
  message?: string
  totalItems?: number
  nextPage?: null
  previousPage?: null
  currentPage?: number
  totalPages?: number
  limit?: number
  data?: OnlineOrder[]
}

export interface OnlineOrder {
  id?: number
  code?: string
  status?: string
  orderDate?: Date
  payment_status?: string
  total_value?: number
  shipping_fee?: number
  total_billing?: number
  receiver?: string
  address?: string
  phone_number?: string
  merchant?: string
}

export interface ProductOfVoucherDataType {
  success?: boolean
  statusCode?: number
  message?: string
  totalItems?: number
  nextPage?: null
  previousPage?: null
  currentPage?: number
  totalPages?: number
  limit?: number
  data: ProductOfVoucher[]
}

export interface ProductOfVoucher {
  id?: number
  thumbnail?: null | string
  name?: string
}

export interface ProductOfVoucherDetail {
  id: number
  thumbnail?: string
  name?: string
  code?: string
  product_id: number
  have_variant: boolean
}
