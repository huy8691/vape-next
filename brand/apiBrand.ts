import { AxiosResponse } from 'axios'
import { callAPIWithToken } from 'src/services/jwt-axios'
import { AddBrandType, brandResponseTypeData } from './brandModel'

const getListBrand = (
  params?: object
): Promise<AxiosResponse<brandResponseTypeData>> => {
  return callAPIWithToken({
    url: `/api/brands/`,
    method: 'GET',
    params: {
      ...params,
    },
  })
}
const addBrand = (
  values: AddBrandType
): Promise<AxiosResponse<brandResponseTypeData>> => {
  return callAPIWithToken({
    url: `/api/brands/`,
    method: 'POST',
    data: values,
  })
}

export { getListBrand, addBrand }
