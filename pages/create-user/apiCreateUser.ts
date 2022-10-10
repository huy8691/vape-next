import { AxiosResponse } from 'axios'
import { callAPIWithToken } from 'src/services/jwt-axios'
import { UserDataType } from './modelCreateUser'

const createUser = (data: UserDataType): Promise<AxiosResponse> => {
  return callAPIWithToken({
    url: `/customers/me`,
    method: 'patch',
    data: data,
  })
}

export { createUser }
