import { AxiosResponse } from 'axios'

import { callAPIWithToken } from 'src/services/jwt-axios'
import { AccountDataType } from './accountModel'

const updateUserInfo = (data: AccountDataType): Promise<AxiosResponse> => {
  console.log('update', data)
  return callAPIWithToken({
    url: `/api/user/me/profile/`,
    method: 'put',
    data: data,
  })
}

export { updateUserInfo }
