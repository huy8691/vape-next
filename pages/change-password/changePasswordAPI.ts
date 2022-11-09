import { AxiosResponse } from 'axios'
import { callAPI } from 'src/services/jwt-axios'
import { NewPasswordType } from './changePasswordModels'

const setNewPasswordApi = (data: NewPasswordType): Promise<AxiosResponse> => {
  return callAPI({
    url: '/api/user/change-password/',
    method: 'put',
    data: data,
  })
}

export { setNewPasswordApi }
