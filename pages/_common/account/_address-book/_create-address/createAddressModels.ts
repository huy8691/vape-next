export interface CreateAddressBookDataType {
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

export interface CreateAddressBookDataResponseType {
  success: string
  status: number
  message: string
  data: CreateAddressBookDataType[]
}
