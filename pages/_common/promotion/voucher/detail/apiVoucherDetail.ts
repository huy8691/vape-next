import { AxiosResponse } from 'axios'
import { callAPIWithToken } from 'src/services/jwt-axios'
import {
  OnlineOrderDataType,
  ProductOfVoucherDataType,
  VoucherDetailDataType,
} from './modelVoucherDetail'

const getVoucherDetail = (
  voucher_id: string | number
): Promise<AxiosResponse<VoucherDetailDataType>> => {
  return callAPIWithToken({
    url: `/api/voucher/${voucher_id}/`,
    method: 'get',
  })
}

const putActiveDeactivate = (voucher_id: number): Promise<AxiosResponse> => {
  return callAPIWithToken({
    url: `api/voucher/${voucher_id}/`,
    method: 'patch',
  })
}

const getOnlineOrders = (
  params?: object
): Promise<AxiosResponse<OnlineOrderDataType>> => {
  return callAPIWithToken({
    url: `/api/merchant/orders/wholesale/`,
    method: 'get',
    params: {
      type: 'SALE',
      ...params,
    },
  })
}

const getRetailOrders = (params?: object): Promise<AxiosResponse> => {
  return callAPIWithToken({
    url: `api/merchant/customer-order/`,
    method: 'get',
    params: {
      ...params,
    },
  })
}

const getListProductOfVoucher = (
  voucherId?: number,
  page?: number
): Promise<AxiosResponse<ProductOfVoucherDataType>> => {
  return callAPIWithToken({
    url: `/api/voucher/${voucherId}/products/`,
    method: 'get',
    params: {
      page,
    },
  })
}

const deleteVoucherProduct = (voucherId?: number): Promise<AxiosResponse> => {
  return callAPIWithToken({
    url: `/api/voucher/${voucherId}/`,
    method: 'delete',
  })
}

export {
  getVoucherDetail,
  putActiveDeactivate,
  getOnlineOrders,
  getRetailOrders,
  getListProductOfVoucher,
  deleteVoucherProduct,
}
