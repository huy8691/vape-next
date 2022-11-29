import { AxiosResponse } from 'axios'
import { callAPIWithToken } from 'src/services/jwt-axios'
import { CreateOrderType, VerifyArrayCartItem } from './checkoutModel'

const verifyCartItem = (value: VerifyArrayCartItem): Promise<AxiosResponse> => {
  return callAPIWithToken({
    url: `api/cart/verify-product/`,
    method: 'post',
    data: {
      cart_items: value,
    },
  })
}

const createOrderItem = (value: CreateOrderType): Promise<AxiosResponse> => {
  return callAPIWithToken({
    url: `/api/customer/order/`,
    method: 'post',
    data: value,
  })
}

const getItemForCheckout = (
  value: VerifyArrayCartItem
): Promise<AxiosResponse> => {
  return callAPIWithToken({
    url: `/api/customer/items-checkout/`,
    method: 'post',
    data: {
      cardItemIds: value,
    },
  })
}

const calculateOrderTotal = (
  value: VerifyArrayCartItem
): Promise<AxiosResponse> => {
  return callAPIWithToken({
    url: `/api/customer/total-bill-order/`,
    method: 'post',
    data: {
      cardItemIds: value,
      shipping_method: 1,
    },
  })
}

export {
  verifyCartItem,
  createOrderItem,
  getItemForCheckout,
  calculateOrderTotal,
}
