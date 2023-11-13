import { AxiosResponse } from 'axios'
import { callAPIWithToken } from 'src/services/jwt-axios'
import { WarehouseResponseType } from './warehouseModel'

export const getWarehouseBelongToUser = (
  params?: object
): Promise<AxiosResponse<WarehouseResponseType>> => {
  return callAPIWithToken({
    url: `/api/warehouse/`,
    method: 'get',
    params: {
      ...params,
    },
  })
}
export const setDefaultWarehouseApi = (
  warehouse_id: unknown
): Promise<AxiosResponse> => {
  return callAPIWithToken({
    url: `/api/warehouse/${warehouse_id}/`,
    method: 'patch',
  })
}
export const deleteWarehouseApi = (
  warehouse_id: unknown
): Promise<AxiosResponse> => {
  return callAPIWithToken({
    url: `/api/warehouse/${warehouse_id}/`,
    method: 'delete',
  })
}
