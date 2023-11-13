import { AxiosResponse } from 'axios'
import { callAPIWithToken } from 'src/services/jwt-axios'
import {
  AdjustInstockType,
  AttributeResponseType,
  DistributionResponseType,
  ProductDetailResponseType,
  QuantityProductInWarehouseResponseType,
  RetailPriceDataType,
  SetRetailPriceDataResponseType,
  SubmitAddNewProductVariantType,
  SubmitUpdateAttributeType,
  // SubmitUpdateAttributeType,
  WarehouseAdjustInstockTypeResponseType,
  WarehouseListDataResponseType,
  // WishListDataType,
} from './modelProductDetail'

const getProductDetail = (
  productId?: string | string[]
): Promise<AxiosResponse<ProductDetailResponseType>> => {
  return callAPIWithToken({
    url: `/api/inventory/products/${productId}`,
    method: 'get',
  })
}

const getWareHouse = (): Promise<
  AxiosResponse<WarehouseAdjustInstockTypeResponseType>
> => {
  return callAPIWithToken({
    url: `api/warehouse/`,
    method: 'get',
  })
}
const getQuantityProductInWareHouse = (
  warehouse_id: number,
  product_id: number
): Promise<AxiosResponse<QuantityProductInWarehouseResponseType>> => {
  return callAPIWithToken({
    url: `api/warehouse/${warehouse_id}/products/${product_id}`,
    method: 'get',
  })
}
const adjustInstock = (data: AdjustInstockType): Promise<AxiosResponse> => {
  return callAPIWithToken({
    url: `/api/product/adjust-stock/`,
    method: 'put',
    data: data,
  })
}
const configLowStockAlertLevel = (
  id: number,
  data: {
    low_stock_alert_level: number
  }
): Promise<AxiosResponse> => {
  return callAPIWithToken({
    url: `/api/inventory/products/${id}/config-lsal/`,
    method: 'put',
    data: data,
  })
}

const getTransaction = (
  product_id: unknown,
  params?: object
): Promise<AxiosResponse> => {
  return callAPIWithToken({
    url: `/api/inventory/products/${product_id}/stock-transactions/`,
    method: 'get',
    params: {
      ...params,
    },
  })
}

const setRetailPriceAPI = (
  id: string | undefined | string[],
  data: RetailPriceDataType
): Promise<AxiosResponse<SetRetailPriceDataResponseType>> => {
  return callAPIWithToken({
    url: `/api/inventory/products/${id}/update/`,
    method: 'PUT',
    data: data,
  })
}

const getWarehouseforFilter = (
  page?: number,
  params?: object
): Promise<AxiosResponse<WarehouseListDataResponseType>> => {
  return callAPIWithToken({
    url: `/api/warehouse/`,
    method: 'get',
    params: {
      page: page,
      limit: 10,
      ...params,
    },
  })
}
const getAttribute = (
  index: number
): Promise<AxiosResponse<AttributeResponseType>> => {
  return callAPIWithToken({
    url: `/api/attributes/?product=${index}&ordering=products__id`,
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

const addNewVariantToProduct = (data: SubmitAddNewProductVariantType) => {
  return callAPIWithToken({
    url: `/api/inventory/add-variants/`,
    method: 'post',
    data: data,
  })
}
const updateAttribute = (
  index: number,
  data: SubmitUpdateAttributeType
): Promise<AxiosResponse> => {
  return callAPIWithToken({
    url: `/api/attributes/${index}/`,
    method: 'put',
    data: data,
  })
}

export {
  addNewVariantToProduct,
  getDistribution,
  getAttribute,
  getProductDetail,
  adjustInstock,
  getTransaction,
  getWareHouse,
  getQuantityProductInWareHouse,
  setRetailPriceAPI,
  getWarehouseforFilter,
  configLowStockAlertLevel,
  updateAttribute,
}
