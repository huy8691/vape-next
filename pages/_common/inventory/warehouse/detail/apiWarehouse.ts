import { AxiosResponse } from 'axios'
import { callAPIWithToken } from 'src/services/jwt-axios'
import { platform } from 'src/utils/global.utils'
import {
  ListProductDataType,
  ProductBrandResponseType,
  ProductCategoryResponseType,
  ProductManufacturerResponseType,
  WarehouseDetailResponseType,
} from './warehouseModel'

const getProductInWarehouse = (
  warehouse_id: number,
  params?: object
): Promise<AxiosResponse<ListProductDataType>> => {
  return callAPIWithToken({
    url: `/api/warehouse/${warehouse_id}/products/`,
    method: 'get',
    params: {
      ...params,
    },
  })
}

const getWarehouseDetailApi = (
  warehouse_id: number
): Promise<AxiosResponse<WarehouseDetailResponseType>> => {
  return callAPIWithToken({
    url: `/api/warehouse/${warehouse_id}/`,
    method: 'get',
  })
}

const getProductCategory = (
  page?: number,
  params?: object
): Promise<AxiosResponse<ProductCategoryResponseType>> => {
  const urlAPI: {
    [key: string]: string
  } = {
    RETAILER: `/api/merchant/categories/`,
    SUPPLIER: `/api/categories/`,
  }
  return callAPIWithToken({
    url: urlAPI[platform()],
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
): Promise<AxiosResponse<ProductBrandResponseType>> => {
  const urlAPI: {
    [key: string]: string
  } = {
    RETAILER: `/api/merchant/brands/`,
    SUPPLIER: `/api/brands/`,
  }

  return callAPIWithToken({
    url: urlAPI[platform()],
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
): Promise<AxiosResponse<ProductManufacturerResponseType>> => {
  const urlAPI: {
    [key: string]: string
  } = {
    RETAILER: `/api/merchant/manufacturers/`,
    SUPPLIER: `/api/manufacturers/`,
  }
  return callAPIWithToken({
    url: urlAPI[platform()],
    method: 'get',
    params: {
      page: page,
      limit: 10,
      ...params,
    },
  })
}
export {
  getProductInWarehouse,
  getWarehouseDetailApi,
  getProductManufacturer,
  getProductBrand,
  getProductCategory,
}
