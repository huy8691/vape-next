export interface ValidateVoucherType {
  type: string
  availability: string[]
  discount_amount: number
  title: string
  code: string
  start_date: string
  expiry_date: string
  minimum_spend: number | null
  max_discount_amount: number | null
  limit_per_voucher: number
  limit_per_user: number
  product_coverage: string
}
