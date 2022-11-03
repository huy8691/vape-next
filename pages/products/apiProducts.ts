import { AxiosResponse } from 'axios'
import { callAPIWithToken } from 'src/services/jwt-axios'
import {
  ProductListDataResponseType,
  ProductCategoryResponseType,
  ProductBrandResponseType,
} from './modelProducts'

const getProducts = (
  params?: object
): Promise<AxiosResponse<ProductListDataResponseType>> => {
  console.log('parm', params)
  return callAPIWithToken({
    url: `/api/customer/products/`,
    method: 'get',
    params: {
      ...params,
      limit: 18,
    },
  })
}

const getProductCategory = (): Promise<
  AxiosResponse<ProductCategoryResponseType>
> => {
  return callAPIWithToken({
    url: `/api/customer/category/`,
    method: 'get',
  })
}
const getProductBrand = (): Promise<
  AxiosResponse<ProductBrandResponseType>
> => {
  return callAPIWithToken({
    url: `/api/customer/brands/`,
    method: 'get',
  })
}

const getProductManufacturer = (): Promise<
  AxiosResponse<ProductBrandResponseType>
> => {
  return callAPIWithToken({
    url: `/api/customer/manufacturer/`,
    method: 'get',
  })
}

export {
  getProducts,
  getProductCategory,
  getProductBrand,
  getProductManufacturer,
}
