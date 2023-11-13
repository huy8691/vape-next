import { AxiosResponse } from 'axios'
import { callAPIWithToken } from 'src/services/jwt-axios'
import {
  DelayPaymentResponseType,
  DiscountDetailResponseType,
  DiscountOfDCResponseType,
  DistributionListResponseType,
  SetDelayPaymentType,
  SubmitAddRuleType,
} from './discountModel'

const getListDiscountOfDC = (
  id: number,
  params?: object
): Promise<AxiosResponse<DiscountOfDCResponseType>> => {
  console.log('params', params)
  return callAPIWithToken({
    url: `/api/discount/organization/${id}/list`,
    method: 'get',
    params: params,
  })
}
const getListDCForApplytoDiscount = (
  id: number
): Promise<AxiosResponse<DistributionListResponseType>> => {
  return callAPIWithToken({
    url: `/api/distribution_channels/organization/${id}/available/discount/`,
    method: 'get',
  })
}
const getDetailDiscount = (
  discount_id: number,
  org_id: number
): Promise<AxiosResponse<DiscountDetailResponseType>> => {
  return callAPIWithToken({
    url: `/api/discount/${discount_id}/organization/${org_id}/`,
    method: 'get',
  })
}
const deleteDiscount = (discount_id: number): Promise<AxiosResponse> => {
  return callAPIWithToken({
    url: `/api/discount/detail/${discount_id}/`,
    method: 'delete',
  })
}
const createDiscountForMerchant = (
  data: SubmitAddRuleType
): Promise<AxiosResponse> => {
  return callAPIWithToken({
    url: `/api/discount/`,
    method: 'post',
    data: data,
  })
}
const updateDiscountForMerchant = (
  discount_id: number,
  org_id: number,
  data: SubmitAddRuleType
): Promise<AxiosResponse> => {
  return callAPIWithToken({
    url: `/api/discount/${discount_id}/organization/${org_id}/`,
    method: 'put',
    data: data,
  })
}
const getDelayPayment = (
  id: number
): Promise<AxiosResponse<DelayPaymentResponseType>> => {
  return callAPIWithToken({
    url: `/api/organization/retailer/${id}/delay-payment/`,
    method: 'get',
  })
}
const setDelayPayment = (
  id: number,
  data: SetDelayPaymentType
): Promise<AxiosResponse> => {
  return callAPIWithToken({
    url: `/api/organization/retailer/${id}/delay-payment/`,
    method: 'put',
    data: data,
  })
}

export {
  updateDiscountForMerchant,
  getListDiscountOfDC,
  getListDCForApplytoDiscount,
  createDiscountForMerchant,
  getDetailDiscount,
  deleteDiscount,
  getDelayPayment,
  setDelayPayment,
}
