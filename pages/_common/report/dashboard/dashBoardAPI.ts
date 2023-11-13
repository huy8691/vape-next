import { AxiosResponse } from 'axios'
import {
  SalesTrendListResponseType,
  OrdersTrendListResponseType,
  BestSellerListResponseType,
  OrdersListResponseType,
  ProductListResponseType,
  ArrayAddMultiVariantToCartType,
} from './dashBoardModels'
import { callAPIWithToken } from 'src/services/jwt-axios'
import { platform } from 'src/utils/global.utils'

export const getSalesTrend = (params: {
  fromDate: string
  toDate: string
  type?: string
}): Promise<AxiosResponse<SalesTrendListResponseType>> => {
  const urlAPI: {
    [key: string]: string
  } = {
    RETAILER: params?.type
      ? `api/report/merchant/sales-trend`
      : `api/report/merchant/all/sales-trend`,
    SUPPLIER: `api/report/supplier/sales-trend`,
  }
  return callAPIWithToken({
    url: urlAPI[platform()],
    method: 'get',
    params: params,
  })
}

export const getOrdersTrend = (params: {
  fromDate: string
  toDate: string
  type?: string
}): Promise<AxiosResponse<OrdersTrendListResponseType>> => {
  const urlAPI: {
    [key: string]: string
  } = {
    RETAILER: params?.type
      ? `api/report/merchant/orders-trend`
      : `api/report/merchant/all/orders-trend`,
    SUPPLIER: `api/report/supplier/orders-trend`,
  }
  return callAPIWithToken({
    url: urlAPI[platform()],
    method: 'get',
    params: params,
  })
}

export const getBestSeller = (params: {
  fromDate: string
  toDate: string
  type?: string
}): Promise<AxiosResponse<BestSellerListResponseType>> => {
  const urlAPI: {
    [key: string]: string
  } = {
    RETAILER: params?.type
      ? `api/report/merchant/products/top-seller`
      : `api/report/merchant/all/products/top-seller`,
    SUPPLIER: `api/report/supplier/products/top-seller`,
  }
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
  console.log('typetypetype', params)
  return callAPIWithToken({
    url: urlAPI[platform()],
    method: 'get',
    params: params,
  })
}

export const getProductLowStock = (params: {
  page?: number
  limit?: number
}): Promise<AxiosResponse<ProductListResponseType>> => {
  const urlAPI: {
    [key: string]: string
  } = {
    RETAILER: `api/report/list-product/low-stock`,
    SUPPLIER: `api/report/list-product/low-stock`,
  }
  return callAPIWithToken({
    url: urlAPI[platform()],
    method: 'get',
    params: params,
  })
}

export const getProductSlowMoving = (params: {
  page?: number
  limit?: number
}): Promise<
  AxiosResponse<{
    data: {
      name: string
      id: number
      thumbnail: string
      sold_products: number
      unit_type: string
    }[]
  }>
> => {
  const urlAPI: {
    [key: string]: string
  } = {
    RETAILER: `api/report/slow-moving-products/`,
    SUPPLIER: `api/report/slow-moving-products/`,
  }
  return callAPIWithToken({
    url: urlAPI[platform()],
    method: 'get',
    params: params,
  })
}

export const addToCart = (
  data: ArrayAddMultiVariantToCartType
): Promise<AxiosResponse> => {
  return callAPIWithToken({
    url: `/api/cart/add-multi-variants/`,
    method: 'post',
    data: data,
  })
}
