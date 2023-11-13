import { AxiosResponse } from 'axios'
import { callAPIWithToken } from 'src/services/jwt-axios'

export const getDetailExternalOrder = (
  order_id: number
): Promise<AxiosResponse> => {
  return callAPIWithToken({
    url: `/api/external-order/${order_id}/`,
    method: 'get',
  })
}

export const deleteExternalOrder = (
  order_id: number
): Promise<AxiosResponse> => {
  return callAPIWithToken({
    url: `/api/external-order/${order_id}/`,
    method: 'delete',
  })
}

export const exportInvoiceExternalOrder = (order_id: number) => {
  return callAPIWithToken({
    url: `api/external-order/${order_id}/export/`,
    method: 'get',
  })
}
