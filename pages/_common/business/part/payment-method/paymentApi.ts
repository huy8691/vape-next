import { AxiosResponse } from 'axios'
import { callAPIWithToken } from 'src/services/jwt-axios'
import { ListCardResponseType } from './paymentModel'
const getListCard = (): Promise<AxiosResponse<ListCardResponseType>> => {
  return callAPIWithToken({
    url: `/api/mxmerchant/customer/cards/`,
    method: 'get',
  })
}

const getCustomerIdRevitPay = (): Promise<AxiosResponse> => {
  return callAPIWithToken({
    url: `/api/revitpay/customer/`,
    method: 'get',
  })
}

const setDefaultCard = (
  token: string,
  cardID: number
): Promise<AxiosResponse> => {
  return callAPIWithToken({
    url: `/api/mxmerchant/set-default/card/`,
    method: 'put',
    data: {
      payment_token: token,
      vault_card_id: cardID,
    },
  })
}
const removeCard = (cardID: number): Promise<AxiosResponse> => {
  return callAPIWithToken({
    url: `/api/mxmerchant/remove/card/`,
    method: 'put',
    data: {
      vault_card_id: cardID,
    },
  })
}
const removeCardRevitpay = (cardID: number): Promise<AxiosResponse> => {
  return callAPIWithToken({
    url: `/api/revitpay/customer/cards/${cardID}/`,
    method: 'delete',
  })
}
const getConfigPayment = (): Promise<AxiosResponse> => {
  return callAPIWithToken({
    url: 'api/organnization/payment/config/',
    method: 'get',
  })
}
export {
  getListCard,
  setDefaultCard,
  removeCard,
  getConfigPayment,
  getCustomerIdRevitPay,
  removeCardRevitpay,
}
