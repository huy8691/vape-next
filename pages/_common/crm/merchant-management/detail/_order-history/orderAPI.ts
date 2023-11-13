import { AxiosResponse } from 'axios'
import { callAPIWithToken } from 'src/services/jwt-axios'
import { OrderMerchantDataResponseType } from './orderHistoryModel'

const getOrderListOfMerchant = (
  id: number,
  params?: object
): Promise<AxiosResponse<OrderMerchantDataResponseType>> => {
  console.log('params', params)
  return callAPIWithToken({
    url: `/api/organization/${id}/order/`,
    method: 'get',
    params: {
      ...params,
    },
  })
}

export { getOrderListOfMerchant }
