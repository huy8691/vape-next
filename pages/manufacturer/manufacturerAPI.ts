import { AxiosResponse } from 'axios'
import { callAPIWithToken } from 'src/services/jwt-axios'
import { postResponseType } from './manufacturerModel'

export const getListManufacturers = (
  params?: object
): Promise<AxiosResponse> => {
  return callAPIWithToken({
    url: `/api/manufacturers`,
    method: 'get',
    params: {
      ...params,
    },
  })
}

export const postManufacturers = (
  value: postResponseType
): Promise<AxiosResponse> => {
  return callAPIWithToken({
    url: `/api/manufacturers/`,
    method: 'post',
    data: value,
  })
}
export const deleteManufacturer = (
  id: number | undefined
): Promise<AxiosResponse> => {
  return callAPIWithToken({
    url: `/api/manufacturers/${id}/`,
    method: 'delete',
  })
}
