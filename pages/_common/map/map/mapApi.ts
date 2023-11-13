import { AxiosResponse } from 'axios'
import { callAPIWithToken } from 'src/services/jwt-axios'
import { ListSellerResponseTypes } from './modelMap'

export const getSellerList = (
  params?: object
): Promise<AxiosResponse<ListSellerResponseTypes>> => {
  return callAPIWithToken({
    url: '/api/map/sellers/',
    method: 'get',
    params: {
      ...params,
      limit: 5,
    },
  })
}
