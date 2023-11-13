import { AxiosResponse } from 'axios'
import { callAPIWithToken } from 'src/services/jwt-axios'
import {
  BusinessProfileResponseType,
  UpdateBusinessType,
} from './businessModel'

const getBusinessProfile = (): Promise<
  AxiosResponse<BusinessProfileResponseType>
> => {
  return callAPIWithToken({
    url: `/api/business-profile/`,
    method: 'get',
  })
}
const updateBusiness = (data: UpdateBusinessType): Promise<AxiosResponse> => {
  return callAPIWithToken({
    url: `/api/business-profile/`,
    method: 'put',
    data: data,
  })
}
export { getBusinessProfile, updateBusiness }
