import { AxiosResponse } from 'axios'

import { callAPIWithToken } from 'src/services/jwt-axios'

import { categoryListResponseType } from './modelProductCategories'
import { platform } from 'src/utils/global.utils'

const getListCategories = (
  page: number,
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
      page: page,
      ...params,
    },
  })
}

export { getListCategories }
