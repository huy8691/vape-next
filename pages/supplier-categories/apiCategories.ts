import { AxiosResponse } from 'axios'
import { callAPIWithToken } from 'src/services/jwt-axios'
import { categoryListResponseType } from './modelProductCategories'

const getListCategories = (
  params?: object
): Promise<AxiosResponse<categoryListResponseType>> => {
  return callAPIWithToken({
    url: `/api/supplier/category/`,
    method: 'GET',
    params: {
      ...params,
    },
  })
}
export { getListCategories }
