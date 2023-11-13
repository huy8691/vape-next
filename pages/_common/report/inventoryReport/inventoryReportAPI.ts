import { AxiosResponse } from 'axios'
import {
  InventoryCategoryResponseType,
  InventoryProductConsumptionsResponseType,
  InventorySummaryResponseRetailType,
  InventoryWarehousesResponseType,
  ListEnumForConsumptionResponseType,
  ProductListResponseType,
} from './inventoryReportModels'
import { callAPIWithToken } from 'src/services/jwt-axios'

export const getProductPurchasedLowStock = (params: {
  page?: number
  limit?: number
}): Promise<AxiosResponse<ProductListResponseType>> => {
  return callAPIWithToken({
    url: '/api/report/inventory/lsal-purchased/',
    method: 'get',
    params: params,
  })
}

export const getProductExistingLowStock = (params: {
  page?: number
  limit?: number
}): Promise<AxiosResponse<ProductListResponseType>> => {
  return callAPIWithToken({
    url: '/api/report/inventory/lsal-existing/',
    method: 'get',
    params: params,
  })
}
export const getSummaryNumber = (): Promise<
  AxiosResponse<InventorySummaryResponseRetailType>
> => {
  return callAPIWithToken({
    url: '/api/report/inventory/summar-numbers/',
    method: 'get',
  })
}
export const getInventoryWarehouses = (): Promise<
  AxiosResponse<InventoryWarehousesResponseType>
> => {
  return callAPIWithToken({
    url: '/api/report/inventory/warehouses/',
    method: 'get',
  })
}
export const getInventoryCategories = (): Promise<
  AxiosResponse<InventoryCategoryResponseType>
> => {
  return callAPIWithToken({
    url: '/api/report/inventory/categories/',
    method: 'get',
  })
}
export const getListEnumConsumption = (
  params: object
): Promise<AxiosResponse<ListEnumForConsumptionResponseType>> => {
  return callAPIWithToken({
    url: '/api/report/list-enum-filter-consumption/',
    method: 'get',
    params: params,
  })
}
export const getInventoryProductConsumption = (
  params: object
): Promise<AxiosResponse<InventoryProductConsumptionsResponseType>> => {
  return callAPIWithToken({
    url: '/api/report/inventory/product-consumption/',
    method: 'get',
    params: { ...params },
  })
}
