import { AxiosResponse } from 'axios'
import { callAPIWithToken } from 'src/services/jwt-axios'
import { UserInfoResponseType } from './userInfoModels'

const userInfoAPI = (): Promise<AxiosResponse<UserInfoResponseType>> => {
  return callAPIWithToken({
    url: '/api/user/me/profile/',
    method: 'get',
  })
}

export { userInfoAPI }
