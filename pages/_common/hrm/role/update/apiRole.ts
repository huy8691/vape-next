import { AxiosResponse } from 'axios'

import { callAPIWithToken } from 'src/services/jwt-axios'

import { roleResponseType, submitAddroleType } from './modelRole'

const getRoleDetail = (
  id: number
): Promise<AxiosResponse<roleResponseType>> => {
  return callAPIWithToken({
    url: `/api/roles/${id}/`,
    method: 'GET',
  })
}

const updateRoleApi = (
  data: submitAddroleType,
  id: number
): Promise<AxiosResponse<roleResponseType>> => {
  return callAPIWithToken({
    url: `/api/roles/${id}/`,
    method: 'put',
    data: data,
  })
}
export { getRoleDetail, updateRoleApi }
