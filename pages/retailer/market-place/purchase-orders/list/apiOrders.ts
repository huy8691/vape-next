import { AxiosResponse } from 'axios'
import { callAPIWithToken } from 'src/services/jwt-axios'
import { OrderListDataResponseType } from './modelOrders'
const getOrders = (
  params?: object
): Promise<AxiosResponse<OrderListDataResponseType>> => {
  return callAPIWithToken({
    url: `/api/merchant/orders/wholesale/`,
    method: 'get',
    params: {
      ...params,
      type: 'BOUGHT',
    },
  })
}

export { getOrders }
