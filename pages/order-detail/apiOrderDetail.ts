import { AxiosResponse } from 'axios'
import { callAPIWithToken } from 'src/services/jwt-axios'
import { OrderDetailTypeResponseType } from './modelOrderDetail'

const getOrderDetail = (
  orderId?: string | string[]
): Promise<AxiosResponse<OrderDetailTypeResponseType>> => {
  console.log('6666', orderId)
  return callAPIWithToken({
    url: `/api/order-detail/${orderId}`,
    method: 'get',
  })
}

export { getOrderDetail }
