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
  remaining: number
}

export type VerifyArrayCartItem = number[]

export interface PaymentMethodListType {
  id: number
  method: string
}

export interface ProfileOfMerchantType {
  customer_id: string
}
export interface ProfileOfMerchantResponseType {
  data: ProfileOfMerchantType
}
export interface CreateOrderDetailType {
  order_id: number
  order_code: string
}
export interface CreateOrderResponseType {
  data: CreateOrderDetailType[]
}

// shipping method phase
export interface OrganizationDetailType {
  id: number
  name: string
  logo: string
}
export interface CartItemGroupingByOrganizationType {
  cartItemId: number
  productName: string
  productCode: string
  productId: number
  productThumbnail: string
  weight: number
  uom: string
  quantity: number
  unitPrice: number
  price_discount: number
  unitType: string
  attribute_options: { attribute: string; option: string }[]
  subTotal: number
  product: {
    id: number
    name: string
  }
}
export interface TermDetailType {
  delay_payment: boolean
  duration: number
}
export interface ListItemCheckoutType {
  organization: OrganizationDetailType
  items: CartItemGroupingByOrganizationType[]
  payment_term: TermDetailType
}

export interface ListItemCheckoutResponseType {
  data: ListItemCheckoutType[]
  errors?: any[]
}
export interface CarrierOfOrganizationType {
  id: number
  name: string
  logo: string
  carrier_id: string
  carrier_code: string
}
export interface CarrierOfOrganizationResponseType {
  data: CarrierOfOrganizationType[]
  errors?: any
}

export interface PickUpLocationOrganizationType {
  id: number
  location: string
  city: string
  state: string
  postal_zipcode: string
  contact_name: string
  contact_phone_number: string
}

export interface PickUpLocationOrganizationResponseType {
  data: PickUpLocationOrganizationType
  errors?: any
}
export interface CurrencyNumberType {
  amount: number
  currency: string
}
export interface ServiceShippingType {
  carrier_code: string
  carrier_delivery_days: number | null
  carrier_friendly_name: string
  carrier_id: string
  carrier_nickname: string
  confirmation_amount: CurrencyNumberType
  delivery_days: number
  error_messages: any[]
  estimated_delivery_date: string
  guaranteed_service: boolean
  insurance_amount: CurrencyNumberType
  negotiated_rate: boolean
  other_amount: CurrencyNumberType
  package_type: string | null
  rate_details: any[]
  rate_type: string
  service_code: string
  service_type: string
  ship_date: string
  shipping_amount: CurrencyNumberType
  trackable: boolean
  validation_status: string
  warning_messages: any[]
  zone: any
}
export interface ListCartItemGroupByOrgType {
  organization: number
  cartItemIds: number[]
  service_shipping?: ServiceShippingType
  shipping_fee?: number
  notes?: string | null
  weight?: number
  carrier?: string
}
export interface RetailerCreateOrderType {
  payment_method: number
  address_name: string
  recipient_name: string
  phone_number: string
  address: string
  shipping_method: number
  city: string
  state: string
  postal_zipcode: string
  items: ListCartItemGroupByOrgType[]
}

export interface PropDataType {
  value: ServiceShippingType
  shippingFee: number
  weight: number
  carrier_id: string
  notes?: string | null
}
