export interface WeightUOMType {
  value: number
  unit: string
}
export interface SubmitPickUpType {
  carrier_ids: string[]
  from_country_code: string
  from_postal_code: string
  from_city_locality: string
  from_state_province: string
  to_country_code: string
  to_postal_code: string
  to_city_locality: string
  to_state_province: string
  weight: WeightUOMType
}

export interface AmountCurrencyType {
  amount: number
  currency: string
}
export interface CalculateShippingType {
  carrier_code: string
  carrier_delivery_days: number | null
  carrier_friendly_name: string
  carrier_id: string
  carrier_nickname: string
  confirmation_amount: AmountCurrencyType
  delivery_days: number
  error_messages: any[]
  service_code: string
  service_type: string
  estimated_delivery_date: string
  guaranteed_service: boolean
  insurance_amount: AmountCurrencyType
  negotiated_rate: boolean
  other_amount: AmountCurrencyType
  package_type: string | null
  rate_details: any[]
  rate_type: string
  ship_date: string
  shipping_amount: AmountCurrencyType
  trackable: boolean
  validation_status: string
  warning_messages: any[]

  zone: any
}

export interface ErrorForShipEngineType {
  error_code: string
  error_source: string
  error_type: string
  field_name: string
  message: string
}
export interface CalculateShippingResponseType {
  message: string
  result: CalculateShippingType[]
  errors?: ErrorForShipEngineType[]
}
export interface AddressDataType {
  id: number
  name: string
  phone_number: string
  receiver_name: string
  address: string
  default_address: boolean
  city: string
  state: string
  postal_zipcode: string
}

export interface PropDataType {
  value: CalculateShippingType
  shippingFee: number
  weight: number
  carrier_id: string
  notes?: string | null
}

export interface GroupingShippingMethodType {
  [key: string]: CalculateShippingType[]
}
