import { AxiosResponse } from 'axios'
import { callAPIWithToken } from 'src/services/jwt-axios'
import { UserDataType, PassWordDataType } from './modelAccount'

const updateInfoUser = (data: UserDataType): Promise<AxiosResponse> => {
  return callAPIWithToken({
    url: `/customers/me`,
    method: 'patch',
    data: data,
  })
}

const updatePasswordUser = (data: PassWordDataType): Promise<AxiosResponse> => {
  return callAPIWithToken({
    url: `/auth/me/password`,
    method: 'patch',
    data: data,
  })
}
export { updateInfoUser, updatePasswordUser }
