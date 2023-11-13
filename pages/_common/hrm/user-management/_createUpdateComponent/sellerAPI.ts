import { AxiosResponse } from 'axios'
import { callAPIWithToken } from 'src/services/jwt-axios'
import { listRoleResponseType } from './sellerModel'

const getListRoles = (
  page: number,
  params?: object
): Promise<AxiosResponse<listRoleResponseType>> => {
  return callAPIWithToken({
    url: '/api/roles/',
    method: 'GET',
    params: {
      ...params,
      page: page,
    },
  })
}
export { getListRoles }
