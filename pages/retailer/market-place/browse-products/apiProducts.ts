import { AxiosResponse } from 'axios'
import { callAPIWithToken } from 'src/services/jwt-axios'
import {
  ProductListDataResponseType,
  ProductCategoryResponseType,
  ProductBrandResponseType,
  SupplierResponseType,
  ProductManufacturerResponseType,
} from './modelProducts'

const getProducts = (
  params?: object,
  limit?: number
): Promise<AxiosResponse<ProductListDataResponseType>> => {
  return callAPIWithToken({
    url: `/api/marketplace/products/`,
    method: 'get',
    params: {
      ...params,
      limit: limit,
    },
  })
}

const getProductCategory = (
  organization?: string | string[],
  page?: number,
  params?: object
): Promise<AxiosResponse<ProductCategoryResponseType>> => {
  return callAPIWithToken({
    url: `/api/categories-marketplace/`,
    method: 'get',
    params: {
      organization: organization,
      page: page,
      limit: 10,
      ...params,
    },
  })
}

const getProductCategoryOnMarketPlace = (
  organization?: string | string[],
  page?: number,
  params?: object
): Promise<AxiosResponse<ProductCategoryResponseType>> => {
  return callAPIWithToken({
    url: `/api/categories-marketplace/`,
    method: 'get',
    params: {
      organization: organization,
      page: page,
      limit: 100,
      ...params,
    },
  })
}

const getProductBrand = (
  organization?: string | string[],
  page?: number,
  params?: object
): Promise<AxiosResponse<ProductBrandResponseType>> => {
  return callAPIWithToken({
    url: `api/brands-filter-on-market-place/`,
    method: 'get',
    params: {
      organization: organization,
      page: page,
      limit: 10,
      ...params,
    },
  })
}

const getProductManufacturer = (
  // organization?: Array<number | null | string>,
  organization?: string | string[],
  page?: number,
  params?: object
): Promise<AxiosResponse<ProductManufacturerResponseType>> => {
  return callAPIWithToken({
    url: `api/manufacturers-filter-on-market-place/`,
    method: 'get',
    params: {
      organization: organization,
      page: page,
      limit: 10,
      ...params,
    },
  })
}
const getSupplier = (): Promise<AxiosResponse<SupplierResponseType>> => {
  return callAPIWithToken({
    url: `api/admin/organizations/`,
    method: 'get',
  })
}

export {
  getProducts,
  getProductCategory,
  getProductCategoryOnMarketPlace,
  getProductBrand,
  getProductManufacturer,
  getSupplier,
}
