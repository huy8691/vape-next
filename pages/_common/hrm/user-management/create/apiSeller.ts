import { AxiosResponse } from 'axios'
import { callAPIWithToken } from 'src/services/jwt-axios'
import { CreateSellerDataType } from './sellerModel'

const createSeller = (data: CreateSellerDataType): Promise<AxiosResponse> => {
  return callAPIWithToken({
    url: `/api/sellers/`,
    method: 'post',
    data: data,
  })
}

export { createSeller }
