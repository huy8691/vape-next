import { AxiosResponse } from 'axios'
import { callAPIWithToken } from 'src/services/jwt-axios'
import {
  ClientDetailResponseType,
  OrderHistoryByClientResponseType,
  SetVipType,
} from './clientDetailModel'

const getListClient = (
  index: number
): Promise<AxiosResponse<ClientDetailResponseType>> => {
  return callAPIWithToken({
    url: `/api/clients/${index}/`,
    method: 'get',
  })
}
const setVipClient = (
  index: number,
  data: SetVipType
): Promise<AxiosResponse<ClientDetailResponseType>> => {
  return callAPIWithToken({
    url: `/api/clients/${index}/`,
    method: 'put',
    data: data,
  })
}
const getOrderHistoryByClient = (
  index: number,
  params?: object
): Promise<AxiosResponse<OrderHistoryByClientResponseType>> => {
  return callAPIWithToken({
    url: `/api/clients/${index}/orders-history/`,
    method: 'get',
    params: {
      ...params,
    },
  })
}

export { getListClient, getOrderHistoryByClient, setVipClient }
