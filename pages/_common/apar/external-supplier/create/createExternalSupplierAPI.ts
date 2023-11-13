import { AxiosResponse } from 'axios'
import { callAPIWithToken } from 'src/services/jwt-axios'

export const createExternalSupplier = (data: {
  name: string
}): Promise<AxiosResponse> => {
  return callAPIWithToken({
    url: '/api/external-supplier/',
    method: 'post',
    data,
  })
}
