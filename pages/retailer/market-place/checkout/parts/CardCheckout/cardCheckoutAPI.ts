import { AxiosResponse } from 'axios'
import { callAPIWithToken } from 'src/services/jwt-axios'
import {
  CustomerResponseType,
  ListCardResponseType,
  SubmitPaymentType,
} from './cardCheckoutModel'
const getCustomerId = (): Promise<AxiosResponse<CustomerResponseType>> => {
  return callAPIWithToken({
    url: `/api/payment/user/`,
    method: 'get',
  })
}
const getListCard = (): Promise<AxiosResponse<ListCardResponseType>> => {
  return callAPIWithToken({
    url: `/api/mxmerchant/customer/cards/`,
    method: 'get',
  })
}
const makeAPaymentWithOrder = (
  data: SubmitPaymentType
): Promise<AxiosResponse> => {
  return callAPIWithToken({
    url: `/api/mxmerchant/payment/market-place/`,
    method: 'post',
    data: data,
  })
}

export { getListCard, makeAPaymentWithOrder, getCustomerId }
