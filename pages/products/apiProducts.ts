import { AxiosResponse } from 'axios'
import { callAPIWithToken } from 'src/services/jwt-axios'
import { ProductListDataResponseType } from './modelProducts'

const getProducts = (
  params: object
): Promise<AxiosResponse<ProductListDataResponseType>> => {
  console.log('parm', params)
  return callAPIWithToken({
    url: `/api/customer/products/`,
    method: 'get',
    params: {
      ...params,
      limit: 20,
    },
  })
}

export { getProducts }
