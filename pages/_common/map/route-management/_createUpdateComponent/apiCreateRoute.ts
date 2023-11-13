import { AxiosResponse } from 'axios'
import { callAPIWithToken } from 'src/services/jwt-axios'
import {
  SellerDataResponseType,
  ContactDataResponseType,
} from './modelCreateRoute'

const getSellerList = (
  params?: object
): Promise<AxiosResponse<SellerDataResponseType>> => {
  return callAPIWithToken({
    url: `/api/sellers/`,
    method: 'get',
    params: {
      ...params,
      limit: 50,
    },
  })
}

const getContactList = (
  params?: object
): Promise<AxiosResponse<ContactDataResponseType>> => {
  return callAPIWithToken({
    url: `/api/contact/`,
    method: 'get',
    params: {
      ...params,
    },
  })
}
const createRoute = (data: {
  seller_id: number
  name: string
  desc: string
  date_from: string
  date_to: string
  origin: string
  destination: string
  optimize: boolean
  locations: {
    address: string
    latitude: string
    longitude: string
    contact: string | null
  }[]
  destination_location: {
    latitude: string
    longitude: string
  }
  origin_location: {
    latitude: string
    longitude: string
  }
}): Promise<AxiosResponse> => {
  return callAPIWithToken({
    url: `/api/travel-scheduling/`,
    method: 'post',
    data: data,
  })
}

export { getSellerList, createRoute, getContactList }
