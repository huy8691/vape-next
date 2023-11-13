import { AxiosResponse } from 'axios'
import { callAPIWithToken } from 'src/services/jwt-axios'
import {
  ExportOrderResponseType,
  OrderDetailTypeResponseType,
  RefundDetailType,
  SaveProductRefundDetailType,
  SendEmailType,
  ValidateWarehouseType,
  WarehouseAndQuantityResponseType,
} from './modelOrderDetail'

const getOrderDetail = (
  orderId: number
): Promise<AxiosResponse<OrderDetailTypeResponseType>> => {
  return callAPIWithToken({
    url: `/api/order-detail/${orderId}`,
    method: 'get',
  })
}

const updateOrderDetail = (
  orderId: string,
  status: string,
  reason?: string
): Promise<AxiosResponse> => {
  return callAPIWithToken({
    url: `/api/order/${orderId}/update/`,
    method: 'put',
    data: {
      status,
      reason,
    },
  })
}
const updatePaymentDetail = (orderId: number): Promise<AxiosResponse> => {
  return callAPIWithToken({
    url: `/api/order/${orderId}/payment/`,
    method: 'put',
  })
}

const approveOrder = (
  order_id: number,
  items: ValidateWarehouseType
): Promise<AxiosResponse> => {
  return callAPIWithToken({
    url: `/api/order/${order_id}/approved/`,
    method: 'patch',
    data: items,
  })
}

const getWarehouseAndQuantity = (
  product_id: number
): Promise<AxiosResponse<WarehouseAndQuantityResponseType>> => {
  return callAPIWithToken({
    url: `/api/products/${product_id}/warehouses/`,
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
    url: `/api/merchant/orders/${order_id}/invoice/export/?order_type=WHOLESALE`,
    method: 'get',
  })
}
export {
  sendInvoiceToEmail,
  exportOrder,
  getOrderDetail,
  updateOrderDetail,
  getWarehouseAndQuantity,
  approveOrder,
  updatePaymentDetail,
  refundRetailOrder,
  saveProductRefund,
}
