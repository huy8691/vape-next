import { AxiosResponse } from 'axios'
import { callAPIWithToken } from 'src/services/jwt-axios'
import { ProductListDataResponseType } from './modelWishList'

const getWishList = (
  params?: object,
  limit?: number
): Promise<AxiosResponse<ProductListDataResponseType>> => {
  return callAPIWithToken({
    url: `/api/merchant/products/favorite/`,
    method: 'get',
    params: {
      ...params,
      limit: limit,
    },
  })
}

export { getWishList }
