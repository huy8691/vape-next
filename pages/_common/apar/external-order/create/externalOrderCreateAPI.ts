import { callAPIWithToken } from 'src/services/jwt-axios'
import {
  AddressDataResponsiveType,
  CreatePayloadType,
  DetailAddressBookDataResponseType,
} from './externalOrderCreateModel'
import { AxiosResponse } from 'axios'

export const createExternalOrder = (
  data: CreatePayloadType
): Promise<AxiosResponse> => {
  return callAPIWithToken({
    url: `/api/external-order/`,
    method: 'post',
    data,
  })
}

export const updateAddressBook = (
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

export const createAddressBookAPI = (data: {
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

export const getListAddress = (
  params?: object
): Promise<AxiosResponse<AddressDataResponsiveType>> => {
  return callAPIWithToken({
    url: `/api/user/address-book/`,
    method: 'get',
    params: params,
  })
}

export const createExternalSupplier = (data: {
  name: string
}): Promise<AxiosResponse> => {
  return callAPIWithToken({
    url: '/api/external-supplier/',
    method: 'post',
    data,
  })
}
