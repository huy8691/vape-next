import { AxiosResponse } from 'axios'
import { callAPIWithToken } from 'src/services/jwt-axios'
import { OrderDetailTypeResponseType } from './modelOrderDetail'

const getOrderDetail = (
  orderId?: string | string[]
): Promise<AxiosResponse<OrderDetailTypeResponseType>> => {
  return callAPIWithToken({
    url: `/api/order-detail/${orderId}`,
    method: 'get',
  })
}

const updateOrderDetail = (
  orderId: string,
  status: string
): Promise<AxiosResponse> => {
  return callAPIWithToken({
    url: `/api/supplier/order/${orderId}/update/`,
    method: 'put',
    data: {
      status,
    },
  })
}

export { getOrderDetail, updateOrderDetail }
