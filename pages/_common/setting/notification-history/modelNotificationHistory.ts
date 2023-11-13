export interface NotificationHistoryItem {
  id?: number
  created_at?: Date
  title?: Message
  message?: Message
  payloadData?: PayloadData
  isRead?: boolean
}

export interface Message {
  [key: string]: string
}

export interface PayloadData {
  iat?: string
  value?: Value
  action?: string
  utcDate?: Date
  utcTime?: string
}

export interface Value {
  quantity?: number
  is_active?: boolean
  replenish?: boolean
  product_id?: number
  product_variant_id?: number
  distribution_channel?: number
}

export interface AddMultiVariantToCartType {
  product_variant: number
  quantity: number | null
  distribution_channel: number
  stockAll?: number
}
export interface ArrayAddMultiVariantToCartType {
  list_variants: AddMultiVariantToCartType[]
}
