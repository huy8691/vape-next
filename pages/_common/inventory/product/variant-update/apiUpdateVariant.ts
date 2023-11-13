import { AxiosResponse } from 'axios'
import { callAPIWithToken } from 'src/services/jwt-axios'
import { platform } from 'src/utils/global.utils'
import {
  AddBrandManufacturerType,
  DistributionResponseType,
  ProductBrandResponseType,
  ProductCategoryResponseType,
  ProductManufacturerResponseType,
  SubmitUpdateVariantType,
  SubmitUpdateWithoutVariantType,
  ValidateCategoryType,
  VariantDetailResponseType,
  ProductCategoryOnMarketPlaceResponseType,
  ListUOMResponseType,
} from './modelUpdateVariant'

const updateWarehouseApi = (
  id: number,
  data: SubmitUpdateVariantType
): Promise<AxiosResponse> => {
  return callAPIWithToken({
    url: `/api/inventory/product-variants/${id}/`,
    method: 'put',
    data: data,
  })
}
const updateProductVariant = (
  id: number,
  data: SubmitUpdateVariantType | SubmitUpdateWithoutVariantType
): Promise<AxiosResponse> => {
  return callAPIWithToken({
    url: `/api/inventory/product-variants/${id}/`,
    method: 'put',
    data: data,
  })
}
const getDetailVariant = (
  variant_id: number
): Promise<AxiosResponse<VariantDetailResponseType>> => {
  return callAPIWithToken({
    url: `/api/inventory/product-variants/${variant_id}/`,
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
const getDistribution = (): Promise<
  AxiosResponse<DistributionResponseType>
> => {
  return callAPIWithToken({
    url: `/api/distribution_channel/`,
    method: 'get',
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
  updateWarehouseApi,
  getDetailVariant,
  updateProductVariant,
  createManufacturer,
  getProductManufacturer,
  createBrand,
  getProductBrand,
  getProductCategory,
  createCategory,
  getDistribution,
  getProductCategoryOnMarketPlace,
  getUOMList,
}
