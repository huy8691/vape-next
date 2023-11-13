import { AxiosResponse } from 'axios'
import { callAPIWithToken } from 'src/services/jwt-axios'
import {
  purchaseOrderDetail,
  purchaseOrderResponseTypeData,
  ValidateWarehouseType,
  WarehouseAndQuantityResponseType,
} from './purchaseModel'

const getListPurchaseOrder = (
  params?: object
): Promise<AxiosResponse<purchaseOrderResponseTypeData>> => {
  return callAPIWithToken({
    url: `/api/purchase-orders/`,
    method: 'GET',
    params: {
      ...params,
    },
  })
}

const getPurchaseOrderDetail = (
  purchase_order_id?: string | string[]
): Promise<AxiosResponse<purchaseOrderDetail>> => {
  return callAPIWithToken({
    url: `/api/purchase-orders/${purchase_order_id}/`,
    method: 'get',
  })
}
const updateApprovedPurchase = (
  purchase_order_id: string,
  status: string
): Promise<AxiosResponse> => {
  return callAPIWithToken({
    url: `/api/purchase-orders/${purchase_order_id}/`,
    method: 'patch',
    data: {
      status,
    },
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
const approveOrder = (
  order_id: number,
  items: ValidateWarehouseType
): Promise<AxiosResponse> => {
  return callAPIWithToken({
    url: `/api/purchase-orders/${order_id}/approved/`,
    method: 'patch',
    data: items,
  })
}
export {
  getListPurchaseOrder,
  getPurchaseOrderDetail,
  updateApprovedPurchase,
  getWarehouseAndQuantity,
  approveOrder,
}
