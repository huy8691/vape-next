import { AxiosResponse } from 'axios'
import { callAPIWithToken } from 'src/services/jwt-axios'
import {
  RoleTypeDataResponseType,
  RoleTypeListDataResponseType,
  UpdateRoleTypeDataType,
} from './modalCreateRoleType'

export const getListPermsBoundary = (
  param: object
): Promise<AxiosResponse<RoleTypeDataResponseType>> => {
  return callAPIWithToken({
    url: `/api/boundary-permissions-of-user/`,
    method: 'get',
    params: {
      ...param,
    },
  })
}

export const getListPermOfRoleType = (
  id: number
): Promise<AxiosResponse<RoleTypeListDataResponseType>> => {
  return callAPIWithToken({
    url: `/api/role-types/${id}/`,
    method: 'GET',
  })
}

export const updateRoleAPI = (
  id: number,
  data: UpdateRoleTypeDataType
): Promise<AxiosResponse> => {
  return callAPIWithToken({
    url: `/api/role-types/${id}/`,
    method: 'PUT',
    data: data,
  })
}
