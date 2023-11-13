import { AxiosResponse } from 'axios'
import { callAPIWithToken } from 'src/services/jwt-axios'
import { ProductDetailResponseType } from './YourSupplierModel'

const getListProduct = (
  id: number
): Promise<AxiosResponse<ProductDetailResponseType>> => {
  return callAPIWithToken({
    url: `api/marketplace/products/?organization=${id}&limit=4`,
    method: 'get',
  })
}

export { getListProduct }
