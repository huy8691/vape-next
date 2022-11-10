import { AxiosResponse } from 'axios'
import { callAPIWithToken } from 'src/services/jwt-axios'
import {
  ProductDetailResponseType,
  ProductListDataResponseType,
  WishListResponseType,
  // WishListDataType,
} from './modelProductDetail'

const getProductDetail = (
  productId?: string | string[]
): Promise<AxiosResponse<ProductDetailResponseType>> => {
  console.log('6666', productId)
  return callAPIWithToken({
    url: `/api/customer/products/${productId}`,
    method: 'get',
  })
}

const getRelatedProduct = (
  params: string | string[]
): Promise<AxiosResponse<ProductListDataResponseType>> => {
  return callAPIWithToken({
    url: `api/customer/products/${params}/related/?limit=6`,
    method: 'get',
  })
}

const postWishList = (
  data?: any
): Promise<AxiosResponse<WishListResponseType>> => {
  return callAPIWithToken({
    url: `/api/customer/products/mark-favorite/`,
    method: 'post',
    data: data,
  })
}
export { getProductDetail, getRelatedProduct, postWishList }
