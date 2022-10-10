import { AxiosResponse } from 'axios'
import { callAPIWithToken } from 'src/services/jwt-axios'
import { UserInfoResponseType } from './userInfoModels'

const userInfoAPI = (): Promise<AxiosResponse<UserInfoResponseType>> => {
  return callAPIWithToken({
    url: '/customers/me',
    method: 'get',
  })
}

export { userInfoAPI }
