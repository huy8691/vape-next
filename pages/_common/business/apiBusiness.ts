import { AxiosResponse } from 'axios'
import { callAPIWithToken } from 'src/services/jwt-axios'
import { BusinessAvatarType, BusinessResponseType } from './businessModel'

const getBusinessProfile = (): Promise<AxiosResponse<BusinessResponseType>> => {
  return callAPIWithToken({
    url: `/api/business-profile/`,
    method: 'get',
  })
}
const updateLogoBusiness = (
  data: BusinessAvatarType
): Promise<AxiosResponse> => {
  return callAPIWithToken({
    url: `/api/business-profile/`,
    method: 'put',
    data: data,
  })
}
export { getBusinessProfile, updateLogoBusiness }
