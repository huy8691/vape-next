import { AxiosResponse } from 'axios'
import { callAPIWithToken } from 'src/services/jwt-axios'
import {
  CalculateShippingResponseType,
  SubmitPickUpType,
} from './productOfOrgModel'

const calculateShippingFee = (
  value: SubmitPickUpType
): Promise<AxiosResponse<CalculateShippingResponseType>> => {
  return callAPIWithToken({
    url: `/api/shipping/rates-estimate`,
    method: 'post',
    data: value,
    baseURL: 'https://shipengine.twssolutions.us',
  })
}

export { calculateShippingFee }
