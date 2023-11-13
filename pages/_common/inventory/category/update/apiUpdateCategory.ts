import { AxiosResponse } from 'axios'

import { callAPIWithToken } from 'src/services/jwt-axios'
import {
  CategoryDetailResponseType,
  categoryListResponseType,
  UpdateCategoryType,
} from './modelCategories'
import { platform } from 'src/utils/global.utils'

const updateCategory = (
  value: UpdateCategoryType,
  category_Id?: string | string[]
): Promise<AxiosResponse> => {
  const urlAPI: {
    [key: string]: string
  } = {
    RETAILER: `/api/merchant/categories/${category_Id}/`,
    SUPPLIER: `/api/categories/${category_Id}/`,
  }
  return callAPIWithToken({
    url: urlAPI[platform()],
    method: 'put',
    data: value,
  })
}
const getCategoryDetail = (
  category_Id: number
): Promise<AxiosResponse<CategoryDetailResponseType>> => {
  const urlAPI: {
    [key: string]: string
  } = {
    RETAILER: `/api/merchant/categories/${category_Id}/`,
    SUPPLIER: `/api/categories/${category_Id}/`,
  }

  return callAPIWithToken({
    url: urlAPI[platform()],
    method: 'get',
  })
}
const getListCategories = (): Promise<
  AxiosResponse<categoryListResponseType>
> => {
  const urlAPI: {
    [key: string]: string
  } = {
    RETAILER: `/api/merchant/categories/`,
    SUPPLIER: `/api/categories/`,
  }
  return callAPIWithToken({
    url: urlAPI[platform()],
    method: 'GET',
  })
}

export { updateCategory, getCategoryDetail, getListCategories }
