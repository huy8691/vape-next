import { AxiosResponse } from 'axios'
import {
  SoldProductListResponseType,
  OrdersListResponseType,
  SettlementMoneyResponseType,
} from './settlementReportModels'
import { callAPIWithToken } from 'src/services/jwt-axios'
import { platform } from 'src/utils/global.utils'

export const getSoldProducts = (params: {
  fromDate: string
  toDate: string
  type?: string
  page?: number
  limit?: number
}): Promise<AxiosResponse<SoldProductListResponseType>> => {
  const urlAPI: {
    [key: string]: string
  } = {
    RETAILER: params?.type
      ? `api/report/merchant/settlement/sold-products`
      : `api/report/merchant/settlement/all/sold-products`,
    SUPPLIER: `api/report/supplier/settlement/sold-products`,
  }
  console.log('typetypetype', params)
  return callAPIWithToken({
    url: urlAPI[platform()],
    method: 'get',
    params: params,
  })
}

export const getOrders = (params: {
  fromDate: string
  toDate: string
  type?: string
  page?: number
  limit?: number
}): Promise<AxiosResponse<OrdersListResponseType>> => {
  const urlAPI: {
    [key: string]: string
  } = {
    RETAILER: params?.type
      ? `api/report/merchant/orders`
      : `api/report/merchant/all/list-order`,
    SUPPLIER: `api/report/supplier/online/orders`,
  }
  return callAPIWithToken({
    url: urlAPI[platform()],
    method: 'get',
    params: params,
  })
}

export const getSettlementMoney = (params: {
  fromDate: string
  toDate: string
  type?: string
}): Promise<AxiosResponse<SettlementMoneyResponseType>> => {
  const urlAPI: {
    [key: string]: string
  } = {
    RETAILER: params?.type
      ? `api/report/merchant/settlement/money`
      : `api/report/merchant/settlement/all/money`,
    SUPPLIER: `api/report/supplier/settlement/money`,
  }
  return callAPIWithToken({
    url: urlAPI[platform()],
    method: 'get',
    params: params,
  })
}
