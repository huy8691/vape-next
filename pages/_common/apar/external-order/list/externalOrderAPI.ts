import { AxiosResponse } from 'axios'
import { callAPIWithToken } from 'src/services/jwt-axios'
import {
  ListProductDataType,
  VariantDetailResponseType,
} from '../part/products/productModel'

export const getListExternalOrder = (
  params?: object
): Promise<AxiosResponse> => {
  return callAPIWithToken({
    url: '/api/external-order/',
    method: 'get',
    params: {
      ...params,
    },
  })
}

export const getListExternalSupplier = (
  page: number,
  params?: object
): Promise<AxiosResponse> => {
  return callAPIWithToken({
    url: '/api/external-supplier/',
    method: 'get',
    params: {
      ...params,
      page,
    },
  })
}

export const getProductTheyCreated = (
  params?: object
): Promise<AxiosResponse<ListProductDataType>> => {
  return callAPIWithToken({
    url: `/api/merchant/management/products/`,
    method: 'get',
    params: {
      ...params,
    },
  })
}

export const getDetailVariant = (
  variant_id: number
): Promise<AxiosResponse<VariantDetailResponseType>> => {
  return callAPIWithToken({
    url: `/api/inventory/products/${variant_id}/`,
    method: 'get',
  })
}

export const getProductByOCR = (formData: any): Promise<AxiosResponse> => {
  return callAPIWithToken({
    url: `/api/get-product-by-scan-invoice/`,
    method: 'post',
    data: formData,
  })
}
