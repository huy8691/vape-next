import { AxiosResponse } from 'axios'
import { callAPIWithToken } from 'src/services/jwt-axios'
import { CartResponseType } from './cartModels'

const getCartAPI = (): Promise<AxiosResponse<CartResponseType>> => {
  return callAPIWithToken({
    url: '/api/cart/items/',
    method: 'get',
  })
}

export { getCartAPI }
