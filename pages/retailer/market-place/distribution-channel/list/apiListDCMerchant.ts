import { AxiosResponse } from 'axios'
import { callAPIWithToken } from 'src/services/jwt-axios'

import {
  ListDCMerchantResponsiveType,
  ListOwnedDCType,
} from './listDCMerchantModel'

const ListDataDCMerchant = (
  params: object | null
): Promise<AxiosResponse<ListDCMerchantResponsiveType>> => {
  return callAPIWithToken({
    url: `/api/merchant/distributions/`,
    method: 'GET',
    params: { ...params },
  })
}
const getListOwnedDCMerchant = (
  params: object | null
): Promise<AxiosResponse<ListOwnedDCType>> => {
  return callAPIWithToken({
    url: `/api/distribution_channel/`,
    method: 'GET',
    params: { ...params },
  })
}

const leaveDistributionChannel = (id?: number): Promise<AxiosResponse> => {
  return callAPIWithToken({
    url: `/api/merchant/distributions/${id}/`,
    method: 'DELETE',
  })
}

export { ListDataDCMerchant, leaveDistributionChannel, getListOwnedDCMerchant }
