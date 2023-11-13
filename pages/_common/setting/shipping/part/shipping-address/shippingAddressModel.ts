export interface ShippingAddressSubmitType {
  location: {
    address: string
    latitude: string
    longitude: string
  }
  phone_number: string
  receiver_name: string
  city: string
  state: {
    name: string
    abbreviation: string
  }
  postal_zipcode: string
  // return
  location_return: { address: string; latitude: string; longitude: string }
  phone_number_return: string
  receiver_name_return: string
  city_return: string
  state_return: {
    name: string
    abbreviation: string
  }
  postal_zipcode_return: string
}

export interface ShippingAddressCreateType {
  location: string
  contact_phone_number: string
  contact_name: string
  type: string
  city: string
  state: string
  postal_zipcode: string
}
export interface SubmitShippingAddressType {
  location: string
  phone_number: string
  receiver_name: string
  type: string
  city: string
  state: string
  postal_zipcode: string
}

export interface ShippingAddressResponseType {
  data: ShippingAddressCreateType[]
  errors?: any
}
