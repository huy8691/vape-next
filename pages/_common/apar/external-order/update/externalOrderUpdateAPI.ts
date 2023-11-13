import { callAPIWithToken } from 'src/services/jwt-axios'
import {
  AddressDataResponsiveType,
  CreatePayloadType,
  DetailAddressBookDataResponseType,
} from './externalOrderUpdateModel'
import { AxiosResponse } from 'axios'

export const updateExternalOrder = (
  order_id: string,
  data: CreatePayloadType
): Promise<AxiosResponse> => {
  return callAPIWithToken({
    url: `/api/external-order/${order_id}/`,
    method: 'put',
    data,
  })
}

export const getDetailExternalOrder = (
  order_id: string
): Promise<AxiosResponse> => {
  return callAPIWithToken({
    url: `/api/external-order/${order_id}/`,
    method: 'get',
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
