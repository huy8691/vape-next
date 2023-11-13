import { AxiosResponse } from 'axios'
import { callAPIWithToken } from 'src/services/jwt-axios'
import {
  AddCategoryType,
  GetSampleForORgType,
  SampleCategoryResponseType,
  categoryListResponseType,
} from './modelProductCategories'
import { platform } from 'src/utils/global.utils'

const getListCategories = (
  params?: object
): Promise<AxiosResponse<categoryListResponseType>> => {
  const urlAPI: {
    [key: string]: string
  } = {
    RETAILER: `/api/merchant/categories/`,
    SUPPLIER: `/api/categories/`,
  }
  return callAPIWithToken({
    url: urlAPI[platform()],
    method: 'GET',
    params: {
      ...params,
    },
  })
}
const addCategories = (
  values: AddCategoryType
): Promise<AxiosResponse<categoryListResponseType>> => {
  const urlAPI: {
    [key: string]: string
  } = {
    RETAILER: `/api/merchant/categories/`,
    SUPPLIER: `/api/categories/`,
  }
  return callAPIWithToken({
    url: urlAPI[platform()],
    method: 'POST',
    data: values,
  })
}
const getListSampleCategory = (
  page: number,
  params?: object
): Promise<AxiosResponse<SampleCategoryResponseType>> => {
  return callAPIWithToken({
    url: `/api/sample-categories/`,
    method: 'GET',
    params: {
      page: page,
      limit: 15,
      ...params,
    },
  })
}
const addSampleCategory = (
  values?: GetSampleForORgType
): Promise<AxiosResponse> => {
  return callAPIWithToken({
    url: `/api/categories/get-sample-category/for-org/`,
    method: 'POST',
    data: values ? values : {},
  })
}
const deleteCategories = (
  id: number
): Promise<AxiosResponse<categoryListResponseType>> => {
  const urlAPI: {
    [key: string]: string
  } = {
    RETAILER: `/api/merchant/categories/${id}/`,
    SUPPLIER: `/api/categories/${id}/`,
  }
  return callAPIWithToken({
    url: urlAPI[platform()],
    method: 'Delete',
  })
}
const uploadFileImportApi = (formData: any): Promise<AxiosResponse> => {
  console.log('formData', formData)
  return callAPIWithToken({
    url: '/api/import-categories/',
    method: 'post',
    data: formData,
  })
}

export {
  getListCategories,
  addCategories,
  deleteCategories,
  uploadFileImportApi,
  getListSampleCategory,
  addSampleCategory,
}
