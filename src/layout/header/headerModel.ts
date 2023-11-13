export interface ShippingAddressCreateType {
  location: string
  contact_phone_number: string
  contact_name: string
  type: string
  city: string
  state: string
  postal_zipcode: string
}
export interface ShippingAddressResponseType {
  data: ShippingAddressCreateType[]
  errors?: any
}
