import { AxiosResponse } from 'axios'
import { callAPIWithToken } from 'src/services/jwt-axios'

import {
  AddBrandManufacturerType,
  AttributeResponseType,
  DistributionResponseType,
  ProductBrandResponseType,
  ProductCategoryResponseType,
  ProductManufacturerResponseType,
  ValidateCategoryType,
  WarehouseResponseType,
  ProductCategoryOnMarketPlaceResponseType,
  ListUOMResponseType,
} from './addProductModel'

import { platform } from 'src/utils/global.utils'

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

const createCategory = (
  data: ValidateCategoryType
): Promise<AxiosResponse<ProductCategoryResponseType>> => {
  const urlAPI: {
    [key: string]: string
  } = {
    RETAILER: `/api/merchant/categories/`,
    SUPPLIER: `/api/categories/`,
  }
  return callAPIWithToken({
    url: urlAPI[platform()],
    method: 'post',
    data: data,
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

const createBrand = (
  data: AddBrandManufacturerType
): Promise<AxiosResponse<ProductBrandResponseType>> => {
  const urlAPI: {
    [key: string]: string
  } = {
    RETAILER: `/api/merchant/brands/`,
    SUPPLIER: `/api/brands/`,
  }
  return callAPIWithToken({
    url: urlAPI[platform()],
    method: 'post',
    data: data,
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
const createManufacturer = (
  data: AddBrandManufacturerType
): Promise<AxiosResponse<ProductBrandResponseType>> => {
  const urlAPI: {
    [key: string]: string
  } = {
    RETAILER: `/api/merchant/manufacturers/`,
    SUPPLIER: `/api/manufacturers/`,
  }
  return callAPIWithToken({
    url: urlAPI[platform()],
    method: 'post',
    data: data,
  })
}
const getWareHouse = (): Promise<AxiosResponse<WarehouseResponseType>> => {
  return callAPIWithToken({
    url: `/api/warehouse/`,
    method: 'get',
  })
}
const getDistribution = (): Promise<
  AxiosResponse<DistributionResponseType>
> => {
  return callAPIWithToken({
    url: `/api/distribution_channel/`,
    method: 'get',
  })
}
const getAttributes = (): Promise<AxiosResponse<AttributeResponseType>> => {
  return callAPIWithToken({
    url: `/api/attributes/`,
    method: 'get',
  })
}
const createAttributes = (data: string): Promise<AxiosResponse> => {
  return callAPIWithToken({
    url: `/api/attributes/`,
    method: 'post',
    data: data,
  })
}

const getProductCategoryOnMarketPlace = (
  params?: object
): Promise<AxiosResponse<ProductCategoryOnMarketPlaceResponseType>> => {
  return callAPIWithToken({
    url: `/api/categories-marketplace/`,
    method: 'get',
    params: params,
  })
}
const getUOMList = (
  params?: object
): Promise<AxiosResponse<ListUOMResponseType>> => {
  return callAPIWithToken({
    url: `/api/unit-of-measure/`,
    method: 'get',
    params: params,
  })
}

export {
  getProductCategory,
  getProductBrand,
  getProductManufacturer,
  createManufacturer,
  getWareHouse,
  getDistribution,
  createBrand,
  createCategory,
  createAttributes,
  getAttributes,
  getProductCategoryOnMarketPlace,
  getUOMList,
}
