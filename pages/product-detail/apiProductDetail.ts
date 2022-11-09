import { AxiosResponse } from 'axios'
import { callAPI, callAPIWithToken } from 'src/services/jwt-axios'
import {
  ProductDetailResponseType,
  // ProductListDataResponseType,
  CommentListDataResponseType,
  RelatedListDataResponseType,
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
): Promise<AxiosResponse<RelatedListDataResponseType>> => {
  console.log('7777', params)
  return callAPIWithToken({
    url: `api/customer/products/${params}/related/?limit=6`,
    method: 'get',
  })
}

const getCommentProduct = (
  params: object
): Promise<AxiosResponse<CommentListDataResponseType>> => {
  return callAPI({
    url: `/reviews`,
    method: 'get',
    params: {
      ...params,
      getComments: true,
    },
  })
}
const postWishList = (
  data?: any
): Promise<AxiosResponse<WishListResponseType>> => {
  console.log('8888', data)
  return callAPIWithToken({
    url: `/api/customer/products/mark-favorite/`,
    method: 'post',
    data: data,
  })
}
export { getProductDetail, getRelatedProduct, getCommentProduct, postWishList }
