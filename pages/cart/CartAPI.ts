import { AxiosResponse } from 'axios'
import { callAPIWithToken } from 'src/services/jwt-axios'
import {
  DeletedArrayCartItem,
  // DeletedCartItemType,
  InstockResponseType,
  UpdateQuantityType,
} from './CartModel'

const getInstockAPI = (
  params: number
): Promise<AxiosResponse<InstockResponseType>> => {
  return callAPIWithToken({
    url: `/api/customer/stock-item/${params}`,
    method: 'get',
  })
}

const updateQuantityProduct = (
  value: UpdateQuantityType,
  params: number
): Promise<AxiosResponse> => {
  return callAPIWithToken({
    url: `/api/cart/update-quantity/${params}/`,
    method: 'put',
    data: value,
  })
}
const deleteCartItem = (
  value: DeletedArrayCartItem
): Promise<AxiosResponse> => {
  return callAPIWithToken({
    url: `/api/cart/remove-items/`,
    method: 'delete',
    data: {
      cart_items: value,
    },
  })
}

export { getInstockAPI, updateQuantityProduct, deleteCartItem }
