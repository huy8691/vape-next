import { AxiosResponse } from 'axios'
import { callAPIWithToken } from 'src/services/jwt-axios'
import {
  CarrierOfOrganizationResponseType,
  CreateOrderResponseType,
  ListItemCheckoutResponseType,
  PickUpLocationOrganizationResponseType,
  ProfileOfMerchantResponseType,
  RetailerCreateOrderType,
  VerifyArrayCartItem,
} from './checkoutModel'

const verifyCartItem = (value: VerifyArrayCartItem): Promise<AxiosResponse> => {
  return callAPIWithToken({
    url: `api/cart/verify-product/`,
    method: 'post',
    data: {
      cart_items: value,
    },
  })
}

const createOrderV2 = (
  value: RetailerCreateOrderType
): Promise<AxiosResponse<CreateOrderResponseType>> => {
  return callAPIWithToken({
    url: `/api/v2/order/`,
    method: 'post',
    data: value,
  })
}

const getItemForCheckoutV2 = (
  value: number[]
): Promise<AxiosResponse<ListItemCheckoutResponseType>> => {
  return callAPIWithToken({
    url: `/api/v2/merchant/items-checkout/`,
    method: 'post',
    data: {
      cardItemIds: value,
    },
  })
}

const calculateOrderTotal = (value: number[]): Promise<AxiosResponse> => {
  return callAPIWithToken({
    url: `/api/merchant/total-bill-order/`,
    method: 'post',
    data: {
      cardItemIds: value,
      shipping_method: 1,
    },
  })
}

const getProfileMerchant = (): Promise<
  AxiosResponse<ProfileOfMerchantResponseType>
> => {
  return callAPIWithToken({
    url: `/api/payment/user/`,
    method: 'get',
  })
}
const getCarrierOfOrganization = (
  org_id: number
): Promise<AxiosResponse<CarrierOfOrganizationResponseType>> => {
  return callAPIWithToken({
    url: `/api/organization/${org_id}/list-carriers/`,
    method: 'get',
  })
}
const getPickUpLocation = (
  org_id: number
): Promise<AxiosResponse<PickUpLocationOrganizationResponseType>> => {
  return callAPIWithToken({
    url: `/api/organization/${org_id}/pick-up/`,
    method: 'get',
  })
}

const getCustomerIdRevitPay = (): Promise<AxiosResponse> => {
  return callAPIWithToken({
    url: `/api/revitpay/customer/`,
    method: 'get',
  })
}

export {
  getProfileMerchant,
  getPickUpLocation,
  verifyCartItem,
  calculateOrderTotal,
  getItemForCheckoutV2,
  getCarrierOfOrganization,
  createOrderV2,
  getCustomerIdRevitPay,
}
