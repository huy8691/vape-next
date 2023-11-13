import { AxiosResponse } from 'axios'
import {
  EmailType,
  RegisterResponseType,
  RegisterType,
} from './registerSupplierModel'
import { callAPI } from 'src/services/jwt-axios'

const checkMailApi = (data: EmailType): Promise<AxiosResponse> => {
  return callAPI({
    url: '/api/user/check-email/',
    method: 'put',
    data: data,
  })
}
const registerApi = (
  data: RegisterType
): Promise<AxiosResponse<RegisterResponseType>> => {
  return callAPI({
    url: '/api/user/supplier-request/',
    method: 'post',
    data: data,
  })
}
export { checkMailApi, registerApi }
