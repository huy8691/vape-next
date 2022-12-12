import { AxiosResponse } from 'axios'
import { callAPIWithToken } from 'src/services/jwt-axios'
import {
  AddCategoryType,
  categoryListResponseType,
} from './modelProductCategories'

const getListCategories = (
  params?: object
): Promise<AxiosResponse<categoryListResponseType>> => {
  return callAPIWithToken({
    url: `/api/categories/`,
    method: 'GET',
    params: {
      ...params,
    },
  })
}
const addCategories = (
  values: AddCategoryType
): Promise<AxiosResponse<categoryListResponseType>> => {
  return callAPIWithToken({
    url: `/api/categories/`,
    method: 'POST',
    data: values,
  })
}

export { getListCategories, addCategories }
