import { AxiosResponse } from 'axios'
import { callAPIWithToken } from 'src/services/jwt-axios'
import {
  ExportOrderResponseType,
  RefundDetailType,
  RetailOrderDetailDataResponseType,
  SaveProductRefundDetailType,
  SendEmailType,
} from './retailOrderDetailModel'

const getRetailOrderDetail = (
  Id: number
): Promise<AxiosResponse<RetailOrderDetailDataResponseType>> => {
  return callAPIWithToken({
    url: `/api/merchant/customer-order/${Id}/`,
    method: 'get',
  })
}
const refundRetailOrder = (
  order_id: number,
  data: RefundDetailType
): Promise<AxiosResponse> => {
  return callAPIWithToken({
    url: `/api/order/${order_id}/refund/money/`,
    method: 'put',
    data: data,
  })
}
const saveProductRefund = (
  order_id: number,
  data: SaveProductRefundDetailType
): Promise<AxiosResponse> => {
  return callAPIWithToken({
    url: `/api/order/${order_id}/refund/products/`,
    method: 'post',
    data: data,
  })
}
const sendInvoiceToEmail = (
  order_id: number,
  data: SendEmailType
): Promise<AxiosResponse> => {
  return callAPIWithToken({
    url: `/api/merchant/orders/${order_id}/invoice/send-email/`,
    method: 'post',
    data: data,
  })
}

const exportOrder = (
  order_id: number
): Promise<AxiosResponse<ExportOrderResponseType>> => {
  return callAPIWithToken({
    url: `/api/merchant/orders/${order_id}/invoice/export/?order_type=RETAIL`,
    method: 'get',
  })
}
export {
  getRetailOrderDetail,
  refundRetailOrder,
  saveProductRefund,
  sendInvoiceToEmail,
  exportOrder,
}
