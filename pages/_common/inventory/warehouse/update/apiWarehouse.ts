import { AxiosResponse } from 'axios'
import { callAPIWithToken } from 'src/services/jwt-axios'
import {
  WarehouseDetailResponseType,
  WarehouseDetailType,
} from './warehouseModel'

export const updateWarehouseApi = (
  warehouse_id: number,
  data: WarehouseDetailType
): Promise<AxiosResponse<WarehouseDetailType>> => {
  return callAPIWithToken({
    url: `/api/warehouse/${warehouse_id}/`,
    method: 'put',
    data: data,
  })
}

export const getWarehouseDetailApi = (
  warehouse_id: number
): Promise<AxiosResponse<WarehouseDetailResponseType>> => {
  return callAPIWithToken({
    url: `/api/warehouse/${warehouse_id}/`,
    method: 'get',
  })
}
