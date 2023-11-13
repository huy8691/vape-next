import { AxiosResponse } from 'axios'

import { callAPIWithToken } from 'src/services/jwt-axios'

import {
  AddCategoryType,
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

export { getListCategories, addCategories }
