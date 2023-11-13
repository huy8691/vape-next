import { AxiosResponse } from 'axios'
import { callAPIWithToken } from 'src/services/jwt-axios'
import {
  ShippingAddressResponseType,
  SubmitShippingAddressType,
} from './shippingAddressModel'

export const addShippingAddress = (
  data: SubmitShippingAddressType
): Promise<AxiosResponse> => {
  return callAPIWithToken({
    url: '/api/organization/shipping-address/',
    method: 'post',
    data: data,
  })
}
export const getListShipping = (): Promise<
  AxiosResponse<ShippingAddressResponseType>
> => {
  return callAPIWithToken({
    url: '/api/organization/shipping-address/list/',
    method: 'get',
  })
}
