import { AxiosResponse } from 'axios'
import { callAPIWithToken } from 'src/services/jwt-axios'
import { OrderListDataResponseType } from './modelOrders'
const getOrders = (
  // page: number
  params?: object
  //  {
  //   page: number
  //   status: string | null
  //   code: string | null
  // }
): Promise<AxiosResponse<OrderListDataResponseType>> => {
  // console.log('🚀 ~ file: apiOrders.ts ~ line 7 ~ params', params)
  return callAPIWithToken({
    url: `/api/customer/order/`,
    method: 'get',
    params: {
      // status: params ? params.status : null,
      // page: params ? params.page : 1,
      // code: params ? params.code : null,
      ...params,
    },
  })
}

export { getOrders }
