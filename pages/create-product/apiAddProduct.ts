import { AxiosResponse } from 'axios'
import { callAPI, callAPIWithToken } from 'src/services/jwt-axios'
import {
  AddFormInput,
  ProductBrandResponseType,
  ProductCategoryResponseType,
  RegisterResponseType,
} from './addProductModel'

const CreateProductApi = (
  data: AddFormInput
): Promise<AxiosResponse<RegisterResponseType>> => {
  return callAPIWithToken({
    url: '/api/supplier/products/',
    method: 'post',
    data: data,
  })
}

const getProductCategory = (): Promise<
  AxiosResponse<ProductCategoryResponseType>
> => {
  return callAPIWithToken({
    url: `/api/supplier/category/`,
    method: 'get',
  })
}
const getProductBrand = (): Promise<
  AxiosResponse<ProductBrandResponseType>
> => {
  return callAPIWithToken({
    url: `/api/supplier/brands/`,
    method: 'get',
  })
}

const getProductManufacturer = (): Promise<
  AxiosResponse<ProductBrandResponseType>
> => {
  return callAPIWithToken({
    url: `/api/supplier/manufacturer/`,
    method: 'get',
  })
}

export {
  CreateProductApi,
  getProductCategory,
  getProductBrand,
  getProductManufacturer,
}
