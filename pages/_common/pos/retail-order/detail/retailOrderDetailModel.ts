export interface RetailOrderDetailDataResponseType {
  success: boolean
  status: number
  message: string
  data: RetailOrderDetailDataType
}
export interface OtherProductType {
  other_product_id: number
  product_name: string
  quantity: number
  price: number
  total: number
  unit: string | null
}
export interface CardInformationType {
  expiry_month: number
  expiry_year: number
  last4: string
  type: string
}
export interface TransactionType {
  amount: number
  transaction_type: string
  transaction_id: string
}
export interface RetailOrderDetailDataType {
  id: number
  code: string
  order_date: string
  status: string
  payment_status: string
  payment_method: string
  items: ListItemRetailOrder[]
  total_value: number
  total_billing: number
  total_tip: number
  round_up_amount?: number
  client: ClientDetailType | null
  customer: ClientDetailType | null
  other_products: OtherProductType[]
  cash?: number
  credit?: number
  card_information: CardInformationType
  transactions: TransactionType
}

export interface ListItemRetailOrder {
  id: number
  name: string
  code: string
  thumbnail: string
  quantity: number
  unit_price: number
  min_retail_price: number
  unit_type: string
  total: number
  instock: number
  have_variant?: boolean
  product_id?: number
  is_active?: boolean
  attribute_options?: AttributeOptionInProductDetailType[]
  isSelected?: boolean
}

export interface ClientDetailType {
  first_name: string
  last_name: string | null
  phone_number: string
  email: string
  business_name: string
  address: string
  full_name: string
}
export interface AttributeOptionInProductDetailType {
  attribute: string
  option: string
}
export interface ProductDataType {
  id: number
  name: string
  thumbnail: string
  code: string
  category?: {
    id: number
    name: string
    is_displayed: boolean
  }
  product_id?: number
  retail_price?: number
  min_retail_price?: number
  max_retail_price?: number
  edited_price?: number
  instock?: number
  variants_count?: number
  tempQuantity?: number
  isSelected?: boolean
  is_active?: boolean
  isInvalid?: boolean
  // field for product variant detail
  quantity?: number
  attribute_options?: AttributeOptionInProductDetailType[]
  isAllowed?: boolean
  have_variants?: boolean
}

export interface RefundFormType {
  total_amount: number
  reason?: string | null
}
export interface RefundDetailType {
  cash: number
  credit: number
}

export interface SaveProductRefundDetailType {
  reason: string | null
  total_amount: number
  items: number[]
  other_products: number[]
  refund_include_tip: boolean
}

export interface ExportOrderType {
  url: string
}
export interface SendEmailType {
  invoice_url: string
}
export interface ExportOrderResponseType {
  data: ExportOrderType
}
