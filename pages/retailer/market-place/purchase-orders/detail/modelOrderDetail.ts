export interface ShippingInformationType {
  delivery_fee: number
  ship_date: string
  service: {
    name: string
    code: string
    logo: string
  }
  shipping_address: {
    address: string
    city: string
    receiver: string
    postal_zipcode: string
  }
}

export interface PaymentTermType {
  due_amount: number
  due_date: Date
  payment_term: number
}
export interface OrderDetailType {
  id: number
  code: string
  order_date: string
  status: string
  notes: string
  delivery_fee: number
  payment_status: string
  sub_total: number
  total_billing: number
  //   receiver_name: string
  shipping_address: {
    receiver_name: string
    address_name: string
    phone_number: string
    address: string
  }
  shipping_method: string
  payment_method: string
  items: OrderDataType[]
  history_actions: HistoryType[]
  shipping_information: ShippingInformationType
  loyalty_discount_price: number
  payment_term: PaymentTermType
}

export interface HistoryType {
  action: string
  new_status: string
  old_status: string
  time: string
  type: string
}

export interface AttributeAndOptionsType {
  attribute: string
  option: string
}
export interface ProductVariantDetail {
  id: number
  name: string
}

export interface OrderDataType {
  id: number
  name: string
  code: string
  attribute_options: AttributeAndOptionsType[]
  thumbnail: string
  quantity: number
  unit_price: number
  price_discount?: number

  unit_type: string
  total: number
  product: ProductVariantDetail
}

export interface OrderStatusType {
  id: number
  text: string
  icon: any
  color: string
  textDisplay: string
}
export interface OrderDetailTypeResponseType {
  data?: OrderDetailType
  errors?: any
}

export interface ReasonCancelDataType {
  reason: string
}

export interface CartItemType {
  id: number
}

export interface ListCartItemType {
  cardItemIds: CartItemType[]
}

export interface ListCartItemTypeResponse {
  data: ListCartItemType
}
