import { AxiosResponse } from 'axios'
import {
  PointEarningResponseType,
  UpdateConfigValueType,
} from './pointEarningModel'
import { callAPIWithToken } from 'src/services/jwt-axios'

const getListEarningOfOrg = (
  params?: object
): Promise<AxiosResponse<PointEarningResponseType>> => {
  return callAPIWithToken({
    url: `/api/organization/earnings-config/`,
    method: 'get',
    params: {
      ...params,
      limit: 15,
    },
  })
}
const updateEarningConfig = (
  id: number,
  data: UpdateConfigValueType
): Promise<AxiosResponse<PointEarningResponseType>> => {
  return callAPIWithToken({
    url: `/api/organization/earnings-config/${id}/`,
    method: 'put',
    data: data,
  })
}
export { getListEarningOfOrg, updateEarningConfig }
