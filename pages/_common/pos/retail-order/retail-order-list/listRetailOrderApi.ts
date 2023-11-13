import { AxiosResponse } from 'axios'

import { callAPIWithToken } from 'src/services/jwt-axios'
import { RetailOrderDataResponseType } from './listRetailOrderModels'

const getListRetailOrderAPI = (
  params: any
): Promise<AxiosResponse<RetailOrderDataResponseType>> => {
  return callAPIWithToken({
    url: `/api/merchant/customer-order/`,
    method: 'GET',
    params: params,
  })
}

const downloadExportInvoice = (orderId: number): Promise<AxiosResponse> => {
  return callAPIWithToken({
    url: `/api/merchant/orders/${orderId}/invoice/export/?order_type=RETAIL`,
    method: 'GET',
  })
}

export { getListRetailOrderAPI, downloadExportInvoice }
