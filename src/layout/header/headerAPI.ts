import { AxiosResponse } from 'axios'
import { callAPIWithToken } from 'src/services/jwt-axios'
import { ShippingAddressResponseType } from './headerModel'

export const getListShipping = (): Promise<
  AxiosResponse<ShippingAddressResponseType>
> => {
  return callAPIWithToken({
    url: '/api/organization/shipping-address/list/',
    method: 'get',
  })
}

export const checkInOutWorkLog = (): Promise<AxiosResponse> => {
  return callAPIWithToken({
    url: '/api/user/work-log/update/',
    method: 'put',
  })
}

export const getWorkingStatus = (): Promise<AxiosResponse> => {
  return callAPIWithToken({
    url: '/api/user/working/status/',
    method: 'get',
  })
}
