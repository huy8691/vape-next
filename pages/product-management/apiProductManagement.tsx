import { AxiosResponse } from 'axios'
import { callAPIWithToken } from 'src/services/jwt-axios'
import { ListProductDataType } from './modalProductManagement'

const getProduct = (): Promise<AxiosResponse<ListProductDataType>> => {
  return callAPIWithToken({
    url: `/api/supplier/products/`,
    method: 'get',
  })
}

export { getProduct }
