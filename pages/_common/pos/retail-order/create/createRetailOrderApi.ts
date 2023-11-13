import { AxiosResponse } from 'axios'

import { callAPIWithToken } from 'src/services/jwt-axios'
import {
  BrandListDataResponseType,
  BusinessResponseType,
  CategoryListDataResponseType,
  createRetailOrderType,
  CustomerResponseType,
  DetailVoucherByCodeResponseType,
  ListProductDataType,
  ManufacturerListDataResponseType,
  ProductDetailVariantResponseType,
  ProductFromBarcodeResponseType,
  ResponseCreateRetailOrderResponseType,
  RetailOrderDetailResponseType,
  SubmitCashPaymentType,
} from './createRetailOrderModels'

const getProductForRetailOrder = (
  params?: object
): Promise<AxiosResponse<ListProductDataType>> => {
  return callAPIWithToken({
    url: `/api/merchant/sale/products/`,
    method: 'get',
    params: {
      ...params,
      limit: 15,
    },
  })
}
const createRetailOrder = (
  data: createRetailOrderType
): Promise<AxiosResponse<ResponseCreateRetailOrderResponseType>> => {
  return callAPIWithToken({
    url: `/api/merchant/customer-order/`,
    method: 'post',
    data: data,
  })
}
const getProductCategory = (
  page?: number,
  params?: object
): Promise<AxiosResponse<CategoryListDataResponseType>> => {
  return callAPIWithToken({
    url: `/api/filter/categories/`,
    method: 'get',
    params: {
      page: page,
      limit: 10,
      ...params,
    },
  })
}

const getProductBrand = (
  page?: number,
  params?: object
): Promise<AxiosResponse<BrandListDataResponseType>> => {
  return callAPIWithToken({
    url: `/api/filter/brands/`,
    method: 'get',
    params: {
      page: page,
      limit: 10,
      ...params,
    },
  })
}

const getProductManufacturer = (
  page?: number,
  params?: object
): Promise<AxiosResponse<ManufacturerListDataResponseType>> => {
  return callAPIWithToken({
    url: `/api/filter/manufacturers/`,
    method: 'get',
    params: {
      page: page,
      limit: 10,
      ...params,
    },
  })
}
const getProductVariantDetail = (
  productId: number
): Promise<AxiosResponse<ProductDetailVariantResponseType>> => {
  return callAPIWithToken({
    url: `/api/inventory/products/${productId}`,
    method: 'get',
  })
}
const paidByCashForRetailOrder = (
  data: SubmitCashPaymentType
): Promise<AxiosResponse> => {
  return callAPIWithToken({
    url: `/api/twss/paid/cash/`,
    method: 'post',
    data: data,
  })
}
const getCustomerId = (): Promise<AxiosResponse<CustomerResponseType>> => {
  return callAPIWithToken({
    url: `/api/payment/user/`,
    method: 'get',
  })
}
const getConfigPayment = (): Promise<AxiosResponse> => {
  return callAPIWithToken({
    url: 'api/organnization/payment/config/',
    method: 'get',
  })
}
const getBusinessProfile = (): Promise<AxiosResponse<BusinessResponseType>> => {
  return callAPIWithToken({
    url: `/api/business-profile/`,
    method: 'get',
  })
}
const getRetailDetailOrder = (
  barcode: string
): Promise<AxiosResponse<RetailOrderDetailResponseType>> => {
  return callAPIWithToken({
    url: `/api/organization/retail-order/barcode/?code=${barcode}`,
    method: 'get',
  })
}
const getListProductByBarcode = (
  barcode: string
): Promise<AxiosResponse<ProductFromBarcodeResponseType>> => {
  return callAPIWithToken({
    url: `/api/products/by-code/${barcode}/`,
    method: 'get',
  })
}
const getDetailVoucherByCode = (
  voucher_code: string,
  param_for_clientID?: string
): Promise<AxiosResponse<DetailVoucherByCodeResponseType>> => {
  return callAPIWithToken({
    url: `/api/voucher/get-by-code/${voucher_code}/?on_market_place=False${param_for_clientID}`,
    method: 'get',
  })
}

export {
  getCustomerId,
  getProductVariantDetail,
  getProductForRetailOrder,
  createRetailOrder,
  getProductCategory,
  getProductBrand,
  getProductManufacturer,
  paidByCashForRetailOrder,
  getBusinessProfile,
  getRetailDetailOrder,
  getListProductByBarcode,
  getDetailVoucherByCode,
  getConfigPayment,
}
