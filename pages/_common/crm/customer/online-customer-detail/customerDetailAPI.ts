import { AxiosResponse } from 'axios'
import { callAPIWithToken } from 'src/services/jwt-axios'
import {
  OnlineCustomerDetailResponseType,
  OrderHistoryByClientResponseType,
  SetVipType,
} from './customerDetailModel'

const getDetailOnlineCustomer = (
  index: number
): Promise<AxiosResponse<OnlineCustomerDetailResponseType>> => {
  return callAPIWithToken({
    url: `/api/online-customers/${index}/`,
    method: 'get',
  })
}
const setVipClient = (
  index: number,
  data: SetVipType
): Promise<AxiosResponse> => {
  return callAPIWithToken({
    url: `/api/online-customers/${index}/`,
    method: 'put',
    data: data,
  })
}
const getOrderHistoryByClient = (
  index: number,
  params?: object
): Promise<AxiosResponse<OrderHistoryByClientResponseType>> => {
  return callAPIWithToken({
    url: `/api/online-customers/${index}/order-history/`,
    method: 'get',
    params: {
      ...params,
    },
  })
}

export { getDetailOnlineCustomer, getOrderHistoryByClient, setVipClient }
