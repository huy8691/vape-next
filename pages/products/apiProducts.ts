import { AxiosResponse } from 'axios'
import { callAPI } from 'src/services/jwt-axios'
import { ProductListDataResponseType } from './modelProducts'

const getProducts = (
  params: object
): Promise<AxiosResponse<ProductListDataResponseType>> => {
  console.log('parm', params)
  return callAPI({
    url: `/products/customer`,
    method: 'get',
    params: {
      ...params,
      pageSize: 20,
    },
  })
}

export { getProducts }
