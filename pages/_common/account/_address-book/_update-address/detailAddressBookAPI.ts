import { AxiosResponse } from 'axios'

import { callAPIWithToken } from 'src/services/jwt-axios'
import { DetailAddressBookDataResponseType } from './detailAddressModels'

const detailAddressBook = (
  id: number
): Promise<AxiosResponse<DetailAddressBookDataResponseType>> => {
  return callAPIWithToken({
    url: `/api/user/address-book/${id}/`,
    method: 'get',
  })
}

const updateAddressBook = (
  id: number,
  data: {
    name: string
    receiver_name: string
    phone_number: string
    address: string
    city: string
    state: string
    postal_zipcode: string
  }
): Promise<AxiosResponse<DetailAddressBookDataResponseType>> => {
  return callAPIWithToken({
    url: `/api/user/address-book/${id}/`,
    method: 'put',
    data: data,
  })
}

export { updateAddressBook, detailAddressBook }
