import { AxiosResponse } from 'axios'
import { callAPIWithToken } from 'src/services/jwt-axios'

import { AddressDataResponsiveType } from './listAddressModels'

const getListAddress = (
  params?: object
): Promise<AxiosResponse<AddressDataResponsiveType>> => {
  return callAPIWithToken({
    url: `/api/user/address-book/`,
    method: 'get',
    params: params,
  })
}

const deleteAddressBook = (id?: number | null): Promise<AxiosResponse> => {
  return callAPIWithToken({
    url: `/api/user/address-book/${id}/`,
    method: 'DELETE',
  })
}

const setDefaultAddressBook = (id?: number | null): Promise<AxiosResponse> => {
  return callAPIWithToken({
    url: `/api/user/address-book/${id}/set-default/`,
    method: 'PATCH',
  })
}

export { getListAddress, deleteAddressBook, setDefaultAddressBook }
