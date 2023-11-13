import { AxiosResponse } from 'axios'
import { callAPIWithToken } from 'src/services/jwt-axios'
import {
  LowStockDataSubmitType,
  QuantityOfProductVariantResponseType,
  QuantityProductInWarehouseResponseType,
  SubmitAdjustStock,
  RetailPriceDataType,
  VariantDetailResponseType,
  WarehouseAdjustInstockTypeResponseType,
  StockTransactionResponseType,
  WarehouseListDataResponseType,
  ArrayAddMultiVariantToCartType,
} from './modelProductDetail'

const getDetailVariant = (
  variant_id: number
): Promise<AxiosResponse<VariantDetailResponseType>> => {
  return callAPIWithToken({
    url: `/api/inventory/product-variants/${variant_id}/`,
    method: 'get',
  })
}
const getQuantityProductInWareHouse = (
  warehouse_id: number,
  product_id: number
): Promise<AxiosResponse<QuantityProductInWarehouseResponseType>> => {
  return callAPIWithToken({
    url: `/api/inventory/warehouse/${warehouse_id}/product_variant/${product_id}/get_quantity/`,
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
// const adjustInstock = (data: AdjustInstockType): Promise<AxiosResponse> => {
//   return callAPIWithToken({
//     url: `/api/product/adjust-stock/`,
//     method: 'put',
//     data: data,
//   })
// }
const configLowStockAlertLevel = (
  id: number,
  data: LowStockDataSubmitType
): Promise<AxiosResponse> => {
  return callAPIWithToken({
    url: `/api/inventory/product-variants/${id}/config-lsal/`,
    method: 'put',
    data: data,
  })
}

const getQuantityOfProductVariant = (
  idWarehouse: number,
  idProductVariant: number
): Promise<AxiosResponse<QuantityOfProductVariantResponseType>> => {
  return callAPIWithToken({
    url: `/api/inventory/warehouse/${idWarehouse}/product_variant/${idProductVariant}/get_quantity/`,
    method: 'get',
  })
}

const adjustInstock = (data: SubmitAdjustStock): Promise<AxiosResponse> => {
  return callAPIWithToken({
    url: `/api/product-variant/adjust-stock/`,
    method: 'put',
    data: data,
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
const getTransaction = (
  product_id: number,
  params?: object
): Promise<AxiosResponse<StockTransactionResponseType>> => {
  return callAPIWithToken({
    url: `/api/inventory/products-variant/${product_id}/stock-transactions/`,
    method: 'get',
    params: {
      ...params,
    },
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
// api from cart
const addToCart = (
  data: ArrayAddMultiVariantToCartType
): Promise<AxiosResponse> => {
  return callAPIWithToken({
    url: `/api/cart/add-multi-variants/`,
    method: 'post',
    data: data,
  })
}
export {
  setRetailPrice,
  getQuantityOfProductVariant,
  configLowStockAlertLevel,
  getDetailVariant,
  getQuantityProductInWareHouse,
  getWareHouse,
  adjustInstock,
  getTransaction,
  getWarehouseforFilter,
  addToCart,
}
