import { AxiosResponse } from 'axios'

import { callAPIWithToken } from 'src/services/jwt-axios'
import { RoleListResponseType } from '../list/modelRoles'

const getListRoles = (
  params: object
): Promise<AxiosResponse<RoleListResponseType>> => {
  return callAPIWithToken({
    url: '/api/roles/',
    method: 'GET',
    params: {
      ...params,
    },
  })
}

export { getListRoles }
