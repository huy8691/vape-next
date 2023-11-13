import { AxiosResponse } from 'axios'
import { callAPIWithToken } from 'src/services/jwt-axios'
import { NewPasswordType } from './changePasswordModels'

const setNewPasswordApi = (data: NewPasswordType): Promise<AxiosResponse> => {
  console.log('passss', data)
  return callAPIWithToken({
    url: '/api/user/change-password/',
    method: 'put',
    data: data,
  })
}

export { setNewPasswordApi }
