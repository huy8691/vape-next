import { AxiosResponse } from 'axios'
import { callAPIWithToken } from 'src/services/jwt-axios'
import {
  ListProductDataType,
  ProductBrandResponseType,
  ProductCategoryResponseType,
  ProductManufacturerResponseType,
  RetailPriceDataType,
  SubmitCreateUpdateOCR,
  VariantDetailResponseType,
  WarehouseBelongtoUserResponseType,
  WarehouseResponseType,
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
  params?: object
): Promise<AxiosResponse<ListProductDataType>> => {
  return callAPIWithToken({
    url: `/api/inventory/products/`,
    method: 'get',
    params: {
      ...params,
    },
  })
}
const getProductTheyCreated = (
  params?: object
): Promise<AxiosResponse<ListProductDataType>> => {
  return callAPIWithToken({
    url: `/api/merchant/management/products/`,
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
  variant_id: number
): Promise<AxiosResponse<VariantDetailResponseType>> => {
  return callAPIWithToken({
    url: `/api/inventory/products/${variant_id}/`,
    method: 'get',
  })
}
const setRetailPrice = (
  id: number,
  data: RetailPriceDataType
): Promise<AxiosResponse> => {
  return callAPIWithToken({
    url: `/api/inventory/product-variants/${id}/update-retail-information/`,
    method: 'PUT',
    data: data,
  })
}
const getProductByScanInvoice = (formData: any): Promise<AxiosResponse> => {
  return callAPIWithToken({
    url: `/api/get-product-by-scan-invoice/`,
    method: 'POST',
    data: formData,
  })
}

const getWareHouse = (): Promise<AxiosResponse<WarehouseResponseType>> => {
  return callAPIWithToken({
    url: `/api/warehouse/`,
    method: 'get',
  })
}

const createUpdateProductByOCR = (
  value: SubmitCreateUpdateOCR
): Promise<AxiosResponse> => {
  return callAPIWithToken({
    url: `/api/create-update-products-by-ocr/`,
    method: 'POST',
    data: value,
  })
}
export {
  getProductManufacturer,
  getProductBrand,
  getWarehouseBelongToUser,
  getProductInWarehouse,
  getProductCategory,
  getProductTheyCreated,
  getDetailVariant,
  setRetailPrice,
  getProductByScanInvoice,
  getWareHouse,
  createUpdateProductByOCR,
}
