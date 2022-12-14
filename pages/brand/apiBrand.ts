import { AxiosResponse } from 'axios'
import { callAPIWithToken } from 'src/services/jwt-axios'
import { brandResponseTypeData } from './brandModel'

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

export default getListBrand
