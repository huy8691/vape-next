import { AxiosResponse } from 'axios'
import { callAPIWithToken } from 'src/services/jwt-axios'
import {
  ListCartItemTypeResponse,
  OrderDetailTypeResponseType,
  ReasonCancelDataType,
} from './modelOrderDetail'

const getOrderDetail = (
  orderId?: string | string[]
): Promise<AxiosResponse<OrderDetailTypeResponseType>> => {
  return callAPIWithToken({
    url: `/api/order-detail/${orderId}`,
    method: 'get',
  })
}
const cancelOrder = (
  id: string | undefined | string[],
  data: ReasonCancelDataType
): Promise<AxiosResponse> => {
  console.log(data, id)
  return callAPIWithToken({
    url: `/api/merchant/order/${id}/cancelled/`,
    method: 'PATCH',
    data: data,
  })
}

const apiReOrder = (
  id: number
): Promise<AxiosResponse<ListCartItemTypeResponse>> => {
  return callAPIWithToken({
    url: `/api/order-detail/${id}/re-order/`,
    method: 'PUT',
  })
}

export { getOrderDetail, cancelOrder, apiReOrder }
