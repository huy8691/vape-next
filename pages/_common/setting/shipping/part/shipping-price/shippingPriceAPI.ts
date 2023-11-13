import { AxiosResponse } from 'axios'
import { callAPIWithToken } from 'src/services/jwt-axios'
import {
  ListShippingFeeResponseType,
  ActionShippingFeeType,
  RetailerDataResponseType,
  ListCustomerResponseType,
} from './shippingPriceModel'

const getRetailerList = (
  params?: object
): Promise<AxiosResponse<RetailerDataResponseType>> => {
  return callAPIWithToken({
    url: `/api/joined-organizations/`,
    method: 'get',
    params: {
      ...params,
    },
  })
}
const getCustomerList = (
  params?: object
): Promise<AxiosResponse<ListCustomerResponseType>> => {
  return callAPIWithToken({
    url: `/api/online-customers/`,
    method: 'get',
    params: {
      ...params,
    },
  })
}

const getListShippingFee = (): Promise<
  AxiosResponse<ListShippingFeeResponseType>
> => {
  return callAPIWithToken({
    url: `/api/shipping-fee/list/`,
    method: 'get',
  })
}
const updateActionFee = (
  data: ActionShippingFeeType
): Promise<AxiosResponse> => {
  return callAPIWithToken({
    url: `/api/shipping-fee/update/`,
    method: 'put',
    data: data,
  })
}

export { getRetailerList, updateActionFee, getListShippingFee, getCustomerList }
