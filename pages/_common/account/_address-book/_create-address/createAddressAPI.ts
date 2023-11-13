import { AxiosResponse } from 'axios'
import { callAPIWithToken } from 'src/services/jwt-axios'

const createAddressBookAPI = (data: {
  name: string
  receiver_name: string
  phone_number: string
  address: string
  city: string
  state: string
  postal_zipcode: string
}): Promise<AxiosResponse> => {
  return callAPIWithToken({
    url: '/api/user/address-book/',
    method: 'post',
    data: data,
  })
}

export { createAddressBookAPI }
