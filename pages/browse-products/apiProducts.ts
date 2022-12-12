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
    url: `/api/products/`,
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
    url: `/api/category/`,
    method: 'get',
  })
}
const getProductBrand = (): Promise<
  AxiosResponse<ProductBrandResponseType>
> => {
  return callAPIWithToken({
    url: `/api/brands/`,
    method: 'get',
  })
}

const getProductManufacturer = (): Promise<
  AxiosResponse<ProductBrandResponseType>
> => {
  return callAPIWithToken({
    url: `/api/manufacturer/`,
    method: 'get',
  })
}

export {
  getProducts,
  getProductCategory,
  getProductBrand,
  getProductManufacturer,
}
