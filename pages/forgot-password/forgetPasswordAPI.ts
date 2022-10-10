import { AxiosResponse } from 'axios'
import { callAPI } from 'src/services/jwt-axios'
import {
  EmailType,
  TokenCodeType,
  NewPasswordType,
} from './forgotPasswordModels'

const checkMailApi = (data: EmailType): Promise<AxiosResponse> => {
  return callAPI({
    url: '/api/retrive/verify-email/',
    method: 'put',
    data: data,
  })
}

const checkTokenCodeApi = (data: TokenCodeType): Promise<AxiosResponse> => {
  return callAPI({
    url: '/api/retrive/check-token/',
    method: 'put',
    data: data,
  })
}

const resendTokenCodeApi = (data: EmailType): Promise<AxiosResponse> => {
  return callAPI({
    url: '/api/retrive/resend-token/',
    method: 'put',
    data: {
      ...data,
      token_type: 'RETRIEVE_PASSWORD',
    },
  })
}

const setNewPasswordApi = (data: NewPasswordType): Promise<AxiosResponse> => {
  return callAPI({
    url: '/api/retrive/password/',
    method: 'put',
    data: data,
  })
}

export {
  checkMailApi,
  resendTokenCodeApi,
  checkTokenCodeApi,
  setNewPasswordApi,
}
