/* eslint-disable @typescript-eslint/no-unused-vars */
import { AxiosResponse } from 'axios'
import { callAPIWithToken } from 'src/services/jwt-axios'
import { ArrayAddMultiVariantToCartType } from './modelNotificationHistory'

const getListNotificationHistory = (
  isRead?: string,
  page?: number
): Promise<AxiosResponse> => {
  const filteredValues: any = Object.fromEntries(
    Object.entries({
      page,
      isRead,
      // eslint-disable-next-line no-unused-vars
    }).filter(([_, value]) => !!value)
  )
  return callAPIWithToken({
    url: '/api/notifications/histories/',
    method: 'get',
    params: {
      ...filteredValues,
    },
  })
}

const doMarkAsReadNotifications = (iat?: string): Promise<AxiosResponse> => {
  return callAPIWithToken({
    url: '/api/notifications/mark-read/',
    method: 'put',
    data: {
      iat,
    },
  })
}

const addToCart = (
  data: ArrayAddMultiVariantToCartType
): Promise<AxiosResponse> => {
  return callAPIWithToken({
    url: `/api/cart/add-multi-variants/`,
    method: 'post',
    data: data,
  })
}

export { getListNotificationHistory, doMarkAsReadNotifications, addToCart }
