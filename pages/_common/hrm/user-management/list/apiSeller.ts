import { AxiosResponse } from 'axios'
import { callAPIWithToken } from 'src/services/jwt-axios'
import {
  AssignRoleForUserType,
  CommissionType,
  RoleListResponseType,
  SellerDataResponseType,
} from './sellerModel'

const getSellerList = (
  params?: object
): Promise<AxiosResponse<SellerDataResponseType>> => {
  return callAPIWithToken({
    url: `/api/sellers/`,
    method: 'get',
    params: {
      ...params,
    },
  })
}
const changeCommission = (
  index: number,
  data: CommissionType
): Promise<AxiosResponse<SellerDataResponseType>> => {
  return callAPIWithToken({
    url: `/api/user/change-commission/${index}`,
    method: 'put',
    data: data,
  })
}
const resetPasswordForSeller = (seller_id: number): Promise<AxiosResponse> => {
  return callAPIWithToken({
    url: `/api/reset-password/${seller_id}/`,
    method: 'put',
  })
}

const getListRoles = (
  params?: object
): Promise<AxiosResponse<RoleListResponseType>> => {
  return callAPIWithToken({
    url: '/api/roles/',
    method: 'GET',
    params: {
      ...params,
    },
  })
}
const AssignRoleForUser = (
  data: AssignRoleForUserType
): Promise<AxiosResponse> => {
  return callAPIWithToken({
    url: `/api/user-roles/`,
    method: 'post',
    data: data,
  })
}

export {
  getSellerList,
  changeCommission,
  resetPasswordForSeller,
  getListRoles,
  AssignRoleForUser,
}
