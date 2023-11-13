import { AxiosResponse } from 'axios'
import {
  OverViewOrdersResponseType,
  CustomersOverViewResponseType,
  SellersOverViewResponseType,
} from './overViewModels'
import { callAPIWithToken } from 'src/services/jwt-axios'
import { platform } from 'src/utils/global.utils'

export const getOverView = (params: {
  fromDate: string
  toDate: string
  type?: string
}): Promise<AxiosResponse<OverViewOrdersResponseType>> => {
  console.log('arams?.type', params?.type)
  const urlAPI: {
    [key: string]: string
  } = {
    RETAILER: params?.type
      ? `api/report/merchant/over-view/order`
      : `api/report/merchant/all/over-view/order`,
    SUPPLIER: `api/report/supplier/over-view/order`,
  }

  return callAPIWithToken({
    url: urlAPI[platform()],
    method: 'get',
    params: params,
  })
}

export const getCustomersOverView = (params?: {
  fromDate: string
  toDate: string
  type?: string
}): Promise<AxiosResponse<CustomersOverViewResponseType>> => {
  return callAPIWithToken({
    url: params?.type
      ? `api/report/merchant/settlement/over-view`
      : `api/report/merchant/settlement/all/over-view`,
    method: 'get',
    params: params,
  })
}

export const getSellersOverView = (params: {
  fromDate: string
  toDate: string
}): Promise<AxiosResponse<SellersOverViewResponseType>> => {
  return callAPIWithToken({
    url: `api/report/seller/over-view`,
    method: 'get',
    params: params,
  })
}
