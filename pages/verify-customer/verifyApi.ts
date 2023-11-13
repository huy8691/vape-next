import { AxiosResponse } from 'axios'
import { callAPI } from 'src/services/jwt-axios'
import { DecodeJSONType } from './verifyModel'

export const verifyCustomer = (
  data: DecodeJSONType
): Promise<AxiosResponse> => {
  return callAPI({
    url: `/api/customer-registration/verify-email/`,
    method: 'post',
    data: data,
  })
}
