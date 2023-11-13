import { AxiosResponse } from 'axios'
import { callAPIWithToken } from 'src/services/jwt-axios'
import {
  CreateRoleTypeDataType,
  ListRoleDataResponseType,
  RoleTypeDataResponseType,
} from './modalCreateRoleType'

export const getListPermsBoundary = (
  param: object
): Promise<AxiosResponse<RoleTypeDataResponseType>> => {
  return callAPIWithToken({
    url: `/api/boundary-permissions-of-user/?limit=50`,
    method: 'get',
    params: {
      ...param,
    },
  })
}

export const CreateRoleAPI = (
  data: CreateRoleTypeDataType
): Promise<AxiosResponse> => {
  return callAPIWithToken({
    url: `/api/role-types/`,
    method: 'POST',
    data: data,
  })
}

export const getListRoleAPI = (): Promise<
  AxiosResponse<ListRoleDataResponseType>
> => {
  return callAPIWithToken({
    url: `/api/roles/`,
    method: 'GET',
  })
}
