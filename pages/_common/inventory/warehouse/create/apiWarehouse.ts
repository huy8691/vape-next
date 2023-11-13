import { AxiosResponse } from 'axios'
import { callAPIWithToken } from 'src/services/jwt-axios'
import { CreateWarehouseType } from './warehouseModel'

export const CreateWarehouseApi = (
  data: CreateWarehouseType
): Promise<AxiosResponse<CreateWarehouseType>> => {
  return callAPIWithToken({
    url: '/api/warehouse/',
    method: 'post',
    data: data,
  })
}
