import { AxiosResponse } from 'axios'
import { callAPI } from 'src/services/jwt-axios'
import {
  ProductDetailResponseType,
  ProductListDataResponseType,
  CommentListDataResponseType,
} from './modelProductDetail'

const getProductDetail = (
  productId?: string
): Promise<AxiosResponse<ProductDetailResponseType>> => {
  return callAPI({
    url: `/products/customer/${productId}`,
    method: 'get',
    params: {},
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
