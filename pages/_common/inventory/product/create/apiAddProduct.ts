import { AxiosResponse } from 'axios'
import { callAPIWithToken } from 'src/services/jwt-axios'
import {
  CreateProductDataType,
  SubmitCreateProductVariant,
} from './addProductModel'
import { platform } from 'src/utils/global.utils'

const createProductApi = (
  data: CreateProductDataType
): Promise<AxiosResponse<CreateProductDataType>> => {
  const urlAPI: {
    [key: string]: string
  } = {
    RETAILER: `/api/merchant/management/products/`,
    SUPPLIER: `/api/supplier/products/`,
  }
  return callAPIWithToken({
    url: urlAPI[platform()],
    method: 'post',
    data: data,
  })
}
const createProductVariantApi = (
  data: SubmitCreateProductVariant
): Promise<AxiosResponse<CreateProductDataType>> => {
  return callAPIWithToken({
    url: '/api/product-variants/',
    method: 'post',
    data: data,
  })
}

export { createProductApi, createProductVariantApi }
