export interface InstockType {
  id?: number
  inStock?: number
}

export interface InstockResponseType {
  data?: InstockType
}

export interface UpdateQuantityType {
  quantity?: number
}

export interface CreateOrderType {
  shipping_method: number
  payment_method: number
  cardItemIds: (number | undefined)[]
  notes: string | null
  address_name: string
  recipient_name: string
  phone_number: string
  address: string
}

export interface CalculateOrderType {
  sub_total: number
  delivery_fee: number
  total: number
}

export type VerifyArrayCartItem = (number | undefined)[]
