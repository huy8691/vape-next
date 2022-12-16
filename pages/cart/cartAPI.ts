import { AxiosResponse } from 'axios'

import { callAPIWithToken } from 'src/services/jwt-axios'
import {
  ArrayCartItem,
  // DeletedCartItemType,
  InstockResponseType,
  UpdateQuantityType,
} from './cartModel'

const getInstockAPI = (
  params: number
): Promise<AxiosResponse<InstockResponseType>> => {
  return callAPIWithToken({
    url: `/api/merchant/stock-item/${params}`,
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
const deleteCartItem = (value: ArrayCartItem): Promise<AxiosResponse> => {
  return callAPIWithToken({
    url: `/api/cart/remove-items/`,
    method: 'delete',
    data: {
      cart_items: value,
    },
  })
}
const verifyCartItem = (value: ArrayCartItem): Promise<AxiosResponse> => {
  return callAPIWithToken({
    url: `api/cart/verify-product/`,
    method: 'post',
    data: {
      cart_items: value,
    },
  })
}

export { getInstockAPI, updateQuantityProduct, deleteCartItem, verifyCartItem }
