import { AxiosResponse } from 'axios'
import { callAPIWithToken } from 'src/services/jwt-axios'
import {
  TaxRateBasedOnZipcodeTypeResponse,
  TaxRateResponseType,
  TaxRateSubmitType,
} from './taxModel'

const getBusinessProfile = (): Promise<AxiosResponse<TaxRateResponseType>> => {
  return callAPIWithToken({
    url: `/api/business-profile/`,
    method: 'get',
  })
}
const getTaxRateBasedOnZipcode = (
  zipcode: string
): Promise<AxiosResponse<TaxRateBasedOnZipcodeTypeResponse>> => {
  return callAPIWithToken({
    url: `/api/tax-rate/${zipcode}/`,
    method: 'get',
  })
}
const updateTaxRate = (data: TaxRateSubmitType): Promise<AxiosResponse> => {
  return callAPIWithToken({
    url: `/api/business-profile/`,
    method: 'put',
    data: data,
  })
}
export { getBusinessProfile, getTaxRateBasedOnZipcode, updateTaxRate }
