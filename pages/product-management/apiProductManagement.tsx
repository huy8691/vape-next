import { AxiosResponse } from 'axios'
import { callAPIWithToken } from 'src/services/jwt-axios'
import { ListProductDataType } from './modalProductManagement'

const getProduct = (
  params?: object
): Promise<AxiosResponse<ListProductDataType>> => {
  return callAPIWithToken({
    url: `/api/supplier/products/`,
    method: 'get',
    params: {
      ...params,
    },
  })
}

export { getProduct }
