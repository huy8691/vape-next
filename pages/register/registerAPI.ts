import { AxiosResponse } from 'axios'
import { callAPI } from 'src/services/jwt-axios'
import { RegisterType, RegisterResponseType, EmailType } from './registerModels'

const getMonthlyPurchaseApi = (): Promise<AxiosResponse> => {
  return callAPI({
    url: '/api/monthly-purchase/',
    method: 'get',
  })
}

const getMonthlySaleApi = (): Promise<AxiosResponse> => {
  return callAPI({
    url: '/api/monthly-sale/',
    method: 'get',
  })
}

const getTypeOfSaleApi = (): Promise<AxiosResponse> => {
  return callAPI({
    url: '/api/type-of-sale/',
    method: 'get',
  })
}

const getFindUsOverApi = (): Promise<AxiosResponse> => {
  return callAPI({
    url: '/api/find-us-over/',
    method: 'get',
  })
}

const checkMailApi = (data: EmailType): Promise<AxiosResponse> => {
  return callAPI({
    url: '/api/user/check-email/',
    method: 'put',
    data: data,
  })
}
const registerApi = (
  data: RegisterType
): Promise<AxiosResponse<RegisterResponseType>> => {
  return callAPI({
    url: '/api/user/sign-up/',
    method: 'post',
    data: data,
  })
}

const organizationInfoApi = (data: {
  organization_refferal: string
}): Promise<AxiosResponse<RegisterResponseType>> => {
  return callAPI({
    url: '/api/organization/info/',
    method: 'post',
    data: data,
  })
}

export {
  getMonthlyPurchaseApi,
  getMonthlySaleApi,
  getTypeOfSaleApi,
  getFindUsOverApi,
  registerApi,
  checkMailApi,
  organizationInfoApi,
}
