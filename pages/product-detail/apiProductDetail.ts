import { AxiosResponse } from 'axios'
import { callAPIWithToken } from 'src/services/jwt-axios'
import {
  // InstockProductDataResponseType,
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
    url: `/api/products/${productId}`,
    method: 'get',
  })
}

const getRelatedProduct = (
  params: string | string[]
): Promise<AxiosResponse<ProductListDataResponseType>> => {
  return callAPIWithToken({
    url: `api/merchant/products/${params}/related/?limit=6`,
    method: 'get',
  })
}

const postWishList = (data: {
  product: number
}): Promise<AxiosResponse<WishListResponseType>> => {
  return callAPIWithToken({
    url: `/api/merchant/products/mark-favorite/`,
    method: 'post',
    data: data,
  })
}
const addToCard = (data: {
  product: number
  quantity: number
}): Promise<AxiosResponse> => {
  return callAPIWithToken({
    url: `/api/cart/add/`,
    method: 'post',
    data: data,
  })
}

export { getProductDetail, getRelatedProduct, postWishList, addToCard }
