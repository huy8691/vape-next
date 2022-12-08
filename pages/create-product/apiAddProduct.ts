import { AxiosResponse } from 'axios'
import { callAPIWithToken } from 'src/services/jwt-axios'
import {
  AddBrandType,
  AddManufacturerType,
  CreateProductDataType,
  ProductBrandResponseType,
  ProductCategoryResponseType,
  RegisterResponseType,
} from './addProductModel'

const CreateProductApi = (
  data: CreateProductDataType
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

const createBrand = (
  data: AddBrandType
): Promise<AxiosResponse<ProductBrandResponseType>> => {
  return callAPIWithToken({
    url: `/api/supplier/brands/`,
    method: 'post',
    data: data,
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
const createManufacturer = (
  data: AddManufacturerType
): Promise<AxiosResponse<ProductBrandResponseType>> => {
  return callAPIWithToken({
    url: `/api/supplier/manufacturer/`,
    method: 'post',
    data: data,
  })
}

export {
  CreateProductApi,
  getProductCategory,
  getProductBrand,
  createBrand,
  getProductManufacturer,
  createManufacturer,
}
