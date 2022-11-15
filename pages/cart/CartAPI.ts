import { AxiosResponse } from 'axios'
import { callAPIWithToken } from 'src/services/jwt-axios'
import { InstockResponseType, UpdateQuantityType } from './CartModel'

const getInstockAPI = (
  params: number
): Promise<AxiosResponse<InstockResponseType>> => {
  return callAPIWithToken({
    url: `/api/customer/stock-item/${params}`,
    method: 'get',
  })
}

const updateQuantityProduct = (
  value: UpdateQuantityType
): Promise<AxiosResponse> => {
  return callAPIWithToken({
    url: `/api/cart/update-quantity/${value.cartItemId}/`,
    method: 'put',
    data: value.quantity,
  })
}

export { getInstockAPI, updateQuantityProduct }
