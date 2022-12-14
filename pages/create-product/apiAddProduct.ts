import { AxiosResponse } from 'axios'
import { callAPIWithToken } from 'src/services/jwt-axios'
import {
  AddBrandType,
  AddManufacturerType,
  CreateProductDataType,
  DistributionResponseType,
  ProductBrandResponseType,
  ProductCategoryResponseType,
  WarehouseResponseType,
} from './addProductModel'

const CreateProductApi = (
  data: CreateProductDataType
): Promise<AxiosResponse<CreateProductDataType>> => {
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
    url: `/api/categories/`,
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

const createBrand = (
  data: AddBrandType
): Promise<AxiosResponse<ProductBrandResponseType>> => {
  return callAPIWithToken({
    url: `/api/brands/`,
    method: 'post',
    data: data,
  })
}

const getProductManufacturer = (): Promise<
  AxiosResponse<ProductBrandResponseType>
> => {
  return callAPIWithToken({
    url: `/api/manufacturers/`,
    method: 'get',
  })
}
const createManufacturer = (
  data: AddManufacturerType
): Promise<AxiosResponse<ProductBrandResponseType>> => {
  return callAPIWithToken({
    url: `/api/manufacturers/`,
    method: 'post',
    data: data,
  })
}
const getWareHouse = (): Promise<AxiosResponse<WarehouseResponseType>> => {
  return callAPIWithToken({
    url: `api/supplier/warehouse/`,
    method: 'get',
  })
}
const getDistribution = (): Promise<
  AxiosResponse<DistributionResponseType>
> => {
  return callAPIWithToken({
    url: `/api/supplier/distribution_channel/`,
    method: 'get',
  })
}

export {
  CreateProductApi,
  getProductCategory,
  getProductBrand,
  createBrand,
  getProductManufacturer,
  createManufacturer,
  getWareHouse,
  getDistribution,
}
