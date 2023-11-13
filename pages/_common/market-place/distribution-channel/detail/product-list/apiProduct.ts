import { AxiosResponse } from 'axios'
import { callAPIWithToken } from 'src/services/jwt-axios'
import {
  ProductBrandResponseType,
  ProductCategoryResponseType,
  ProductManufacturerResponseType,
  ListProductDataType,
  WarehouseBelongtoUserResponseType,
  VariantDetailResponseType,
} from './modelProduct'

import { platform } from 'src/utils/global.utils'

const getWarehouseBelongToUser = (
  params?: object
): Promise<AxiosResponse<WarehouseBelongtoUserResponseType>> => {
  return callAPIWithToken({
    url: `/api/warehouse/`,
    method: 'get',
    params: {
      ...params,
    },
  })
}

const getProductInWarehouse = (
  params?: any
): Promise<AxiosResponse<ListProductDataType>> => {
  return callAPIWithToken({
    url: `/api/distribution_channel/${params.id}/products/`,
    method: 'get',
    params: {
      ...params,
    },
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
const getDetailVariant = (
  variant_id: number,
  dc_id: number
): Promise<AxiosResponse<VariantDetailResponseType>> => {
  return callAPIWithToken({
    url: `/api/inventory/products/${variant_id}/?dc_id=${dc_id}`,
    method: 'get',
  })
}
export {
  getDetailVariant,
  getProductManufacturer,
  getProductBrand,
  getWarehouseBelongToUser,
  getProductInWarehouse,
  getProductCategory,
}
