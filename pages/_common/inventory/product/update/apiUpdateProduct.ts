import { AxiosResponse } from 'axios'
import { callAPIWithToken } from 'src/services/jwt-axios'
import {
  ProductDetailResponseType,
  UpdateProductDataType,
} from './updateProductModel'
import { platform } from 'src/utils/global.utils'
const updateProductApi = (
  data: UpdateProductDataType,
  id: number
): Promise<AxiosResponse<UpdateProductDataType>> => {
  const urlAPI: {
    [key: string]: string
  } = {
    RETAILER: `/api/merchant/management/products/${id}/`,
    SUPPLIER: `/api/products/${id}/`,
  }
  return callAPIWithToken({
    url: urlAPI[platform()],
    method: 'put',
    data,
  })
}

const getProductDetail = (
  productId?: string | string[]
): Promise<AxiosResponse<ProductDetailResponseType>> => {
  return callAPIWithToken({
    url: `/api/inventory/products/${productId}`,
    method: 'get',
  })
}

export { updateProductApi, getProductDetail }
