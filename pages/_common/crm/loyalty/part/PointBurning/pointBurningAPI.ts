import { AxiosResponse } from 'axios'
import { callAPIWithToken } from 'src/services/jwt-axios'
import { BurningDetailResponseType } from './pointBurningModel'

const getListBurningOfOrg = (
  page?: string | number
): Promise<AxiosResponse<BurningDetailResponseType>> => {
  return callAPIWithToken({
    url: `/api/organization/burnings-config/`,
    method: 'get',
    params: {
      page: page,
    },
  })
}

const createPointBurning = (
  data: {
    points: number
    loyalty_action: number
    burning_rule: 'FIXAMOUNT' | 'PERCENTAGE'
    value: number
    max_value?: number
  }[]
): Promise<AxiosResponse> => {
  return callAPIWithToken({
    url: `/api/organization/burnings-config/`,
    method: 'post',
    data: {
      items: data,
    },
  })
}

const updatePointBurning = (
  data: {
    points: number
    loyalty_action: number
    burning_rule: 'FIXAMOUNT' | 'PERCENTAGE'
    value: number
    max_value?: number
  }[]
): Promise<AxiosResponse> => {
  return callAPIWithToken({
    url: `/api/organization/burnings-config/update/`,
    method: 'put',
    data: {
      items: data,
    },
  })
}

const deletePointBurning = (id: number): Promise<AxiosResponse> => {
  return callAPIWithToken({
    url: `/api/organization/burnings-config/${id}/`,
    method: 'delete',
  })
}

export {
  getListBurningOfOrg,
  createPointBurning,
  deletePointBurning,
  updatePointBurning,
}
