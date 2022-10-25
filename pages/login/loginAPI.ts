import { AxiosResponse } from 'axios'
import { callAPI, callAPIWithToken } from 'src/services/jwt-axios'
import { LoginResponseType, LoginType } from './loginModels'

const loginAPI = (
  data: LoginType
): Promise<AxiosResponse<LoginResponseType>> => {
  return callAPI({
    url: '/api/user/sign-in/',
    method: 'post',
    data: data,
  })
}

const logOutAPI = (): Promise<AxiosResponse<LoginResponseType>> => {
  return callAPIWithToken({
    url: '/api/logout/',
    method: 'post',
  })
}

const userProfileAPI = (): Promise<AxiosResponse> => {
  return callAPIWithToken({
    url: '/api/user/me/profile/',
    method: 'get',
  })
}

export { loginAPI, logOutAPI, userProfileAPI }
