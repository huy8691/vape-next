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
  data: any
): Promise<AxiosResponse<WishListResponseType>> => {
  return callAPIWithToken({
    url: `/api/customer/products/mark-favorite/`,
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

// const getInstockApi = (
//   params: number
// ): Promise<AxiosResponse<InstockProductDataResponseType>> => {
//   return callAPIWithToken({
//     url: `api/customer/stock-items/${params}`,
//     method: 'get',
//   })
// }

export {
  getProductDetail,
  getRelatedProduct,
  postWishList,
  addToCard,
  // getInstockApi,
}
