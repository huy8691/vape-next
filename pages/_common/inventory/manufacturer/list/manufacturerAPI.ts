import { AxiosResponse } from 'axios'

import { callAPIWithToken } from 'src/services/jwt-axios'
import { platform } from 'src/utils/global.utils'
import {
  GetSampleForORgType,
  SampleManuResponseType,
} from './manufacturerModel'

export const getListManufacturers = (
  params?: object
): Promise<AxiosResponse> => {
  const urlAPI: {
    [key: string]: string
  } = {
    RETAILER: `/api/merchant/manufacturers/`,
    SUPPLIER: `/api/manufacturers/`,
  }
  return callAPIWithToken({
    url: urlAPI[platform()],
    method: 'get',
    params: {
      ...params,
    },
  })
}
export const getSampleManu = (
  page: number,
  params?: object
): Promise<AxiosResponse<SampleManuResponseType>> => {
  return callAPIWithToken({
    url: `/api/sample-manufacturers/`,
    method: 'GET',
    params: {
      page: page,
      limit: 15,
      ...params,
    },
  })
}
export const addSampleManu = (
  values: GetSampleForORgType
): Promise<AxiosResponse> => {
  return callAPIWithToken({
    url: `/api/manufacturers/get-sample-manufacturer/for-org/`,
    method: 'POST',
    data: values,
  })
}
export const deleteManufacturer = (id: number): Promise<AxiosResponse> => {
  const urlAPI: {
    [key: string]: string
  } = {
    RETAILER: `/api/merchant/manufacturers/${id}/`,
    SUPPLIER: `/api/manufacturers/${id}/`,
  }
  return callAPIWithToken({
    url: urlAPI[platform()],
    method: 'delete',
  })
}

export const uploadFileImportApi = (formData: any): Promise<AxiosResponse> => {
  console.log('formData', formData)
  return callAPIWithToken({
    url: '/api/import-manufacturers/',
    method: 'post',
    data: formData,
  })
}
