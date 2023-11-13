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
      type: 'SALE',
    },
  })
}

const downloadExportInvoice = (orderId: number): Promise<AxiosResponse> => {
  return callAPIWithToken({
    url: `/api/merchant/orders/${orderId}/invoice/export/?order_type=WHOLESALE`,
    method: 'GET',
  })
}

export { getOrders, downloadExportInvoice }
