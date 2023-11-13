import { AxiosResponse } from 'axios'

import { callAPIWithToken } from 'src/services/jwt-axios'

import { roleListResponseType, ValidateAddroleType } from './modelRole'
const addrole = (
  values: ValidateAddroleType
): Promise<AxiosResponse<roleListResponseType>> => {
  return callAPIWithToken({
    url: '/api/roles/',
    method: 'POST',
    data: values,
  })
}

export { addrole }
