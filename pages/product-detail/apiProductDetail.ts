import { AxiosResponse } from 'axios'
import { callAPI, callAPIWithToken } from 'src/services/jwt-axios'
import {
  ProductDetailResponseType,
  ProductListDataResponseType,
  CommentListDataResponseType,
} from './modelProductDetail'

const getProductDetail = (
  productId?: string | undefined
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
  return callAPI({
    url: `/products/customer/${params}/related?pageSize=6`,
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

export { getProductDetail, getRelatedProduct, getCommentProduct }
