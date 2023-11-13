export interface ListVoucherDataType {
  success?: boolean
  statusCode?: number
  message?: string
  totalItems?: number
  nextPage?: null
  previousPage?: null
  currentPage?: number
  totalPages?: number
  limit?: number
  data?: VoucherData[]
}

export interface VoucherData {
  id?: number
  title?: string
  code?: string
  type?: string
  discount_amount?: number
  usage?: number
  limit?: number
  expiry?: Date
  availability?: string[]
  product_coverage?: string
  status?: string
}
