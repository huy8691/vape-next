import { AxiosResponse } from 'axios'
import { callAPIWithToken } from 'src/services/jwt-axios'
import { RoleTypeDataResponseType } from './modalRoleType'

export const getListRoleType = (
  params: any
): Promise<AxiosResponse<RoleTypeDataResponseType>> => {
  return callAPIWithToken({
    url: `/api/role-types/?role=24`,
    method: 'get',
    params: params,
  })
}
