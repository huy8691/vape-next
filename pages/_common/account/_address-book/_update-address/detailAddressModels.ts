export interface FormAddressBookDataType {
  name: string
  receiver_name: string
  phone_number: string
  address: string
  city: string
  state: {
    name: string
    abbreviation: string
  }
  postal_zipcode: string
}

export interface DetailAddressBookDataResponseType {
  success: string
  status: number
  message: string
  data: {
    name: string
    receiver_name: string
    phone_number: string
    address: string
    city: string
    state: string
    postal_zipcode: string
  }
}
