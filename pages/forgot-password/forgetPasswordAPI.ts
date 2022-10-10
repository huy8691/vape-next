import { AxiosResponse } from 'axios'
import { callAPI } from 'src/services/jwt-axios'
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

export { loginAPI }
