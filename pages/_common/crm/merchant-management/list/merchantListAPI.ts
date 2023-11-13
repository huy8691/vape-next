import { AxiosResponse } from 'axios'
import { callAPIWithToken } from 'src/services/jwt-axios'
import {
  MerchantDataResponseType,
  SellerDataResponseType,
  AssignSellerDataType,
} from './merchantModel'

const getMerchantList = (
  params?: object
): Promise<AxiosResponse<MerchantDataResponseType>> => {
  return callAPIWithToken({
    url: `/api/joined-organizations/`,
    method: 'get',
    params: {
      ...params,
    },
  })
}

const getSellerList = (
  page?: number,
  params?: object
): Promise<AxiosResponse<SellerDataResponseType>> => {
  return callAPIWithToken({
    url: `/api/sellers/`,
    method: 'get',
    params: {
      page: page,
      limit: 10,
      ...params,
    },
  })
}

const assignSellerAPI = (
  id: number,
  data: AssignSellerDataType
): Promise<AxiosResponse<AssignSellerDataType>> => {
  return callAPIWithToken({
    url: `/api/joined-organizations/${id}/assign/`,
    method: 'POST',
    data: data,
  })
}

export { getMerchantList, getSellerList, assignSellerAPI }
