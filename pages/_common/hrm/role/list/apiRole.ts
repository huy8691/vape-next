import { AxiosResponse } from 'axios'
import { callAPIWithToken } from 'src/services/jwt-axios'
import { RoleListResponseType } from './modelRoles'

const getListRoles = (
  params?: object
): Promise<AxiosResponse<RoleListResponseType>> => {
  return callAPIWithToken({
    url: '/api/roles/',
    method: 'GET',
    params: {
      ...params,
    },
  })
}
const deletePermission = (id: number): Promise<AxiosResponse> => {
  return callAPIWithToken({
    url: `/api/roles/${id}/`,
    method: 'DELETE',
  })
}
export { getListRoles, deletePermission }
