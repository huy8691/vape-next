import { AxiosResponse } from 'axios'
import { callAPIWithToken } from 'src/services/jwt-axios'
import {
  AddBrandType,
  GetSampleForORgType,
  SampleBrandResponseType,
  brandResponseTypeData,
} from './brandModel'
import { platform } from 'src/utils/global.utils'

const getListBrand = (
  params?: object
): Promise<AxiosResponse<brandResponseTypeData>> => {
  const urlAPI: {
    [key: string]: string
  } = {
    RETAILER: `/api/merchant/brands/`,
    SUPPLIER: `/api/brands/`,
  }
  return callAPIWithToken({
    url: urlAPI[platform()],
    method: 'GET',
    params: {
      ...params,
    },
  })
}
const getListSampleBrand = (
  page: number,
  params?: object
): Promise<AxiosResponse<SampleBrandResponseType>> => {
  return callAPIWithToken({
    url: `/api/sample-brands/`,
    method: 'GET',
    params: {
      page: page,
      limit: 15,
      ...params,
    },
  })
}
const addBrand = (
  values: AddBrandType
): Promise<AxiosResponse<brandResponseTypeData>> => {
  const urlAPI: {
    [key: string]: string
  } = {
    RETAILER: `/api/merchant/brands/`,
    SUPPLIER: `/api/brands/`,
  }
  return callAPIWithToken({
    url: urlAPI[platform()],
    method: 'POST',
    data: values,
  })
}
const addSampleBrand = (
  values: GetSampleForORgType
): Promise<AxiosResponse> => {
  return callAPIWithToken({
    url: `/api/brands/get-sample-brand/for-org/`,
    method: 'POST',
    data: values,
  })
}
const deleteBrand = (
  id: number
): Promise<AxiosResponse<brandResponseTypeData>> => {
  const urlAPI: {
    [key: string]: string
  } = {
    RETAILER: `/api/merchant/brands/${id}/`,
    SUPPLIER: `/api/brands/${id}/`,
  }
  return callAPIWithToken({
    url: urlAPI[platform()],
    method: 'Delete',
  })
}
const uploadFileImportApi = (formData: any): Promise<AxiosResponse> => {
  console.log('formData', formData)
  return callAPIWithToken({
    url: '/api/import-brands/',
    method: 'post',
    data: formData,
  })
}

export {
  getListBrand,
  addBrand,
  deleteBrand,
  uploadFileImportApi,
  getListSampleBrand,
  addSampleBrand,
}
