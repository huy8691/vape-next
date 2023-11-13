import { AxiosResponse } from 'axios'
import { callAPIWithToken } from 'src/services/jwt-axios'
import {
  AdjustInstockType,
  ArrayAddMultiVariantToCartType,
  DistributionOfProductResponseType,
  DistributionResponseType,
  ProductDetailWithVariantResponseType,
  ProductListDataResponseType,
  WarehouseResponseType,
  WishListResponseType,
} from './modelProductDetail'
const getDistributionChannelOfProduct = (
  product_id: number
): Promise<AxiosResponse<DistributionOfProductResponseType>> => {
  return callAPIWithToken({
    url: `api/distribution-channels-of-product/${product_id}/`,
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

const putWishList = (
  productId: number
): Promise<AxiosResponse<WishListResponseType>> => {
  return callAPIWithToken({
    url: `api/merchant/products/mark-favorite/${productId}/`,
    method: 'put',
  })
}
const addToCart = (
  data: ArrayAddMultiVariantToCartType
): Promise<AxiosResponse> => {
  return callAPIWithToken({
    url: `/api/cart/add-multi-variants/`,
    method: 'post',
    data: data,
  })
}
const getWareHouse = (): Promise<AxiosResponse<WarehouseResponseType>> => {
  return callAPIWithToken({
    // url: `api/supplier/warehouse/`,
    url: `api/warehouse/`,
    method: 'get',
  })
}
const getDistribution = (): Promise<
  AxiosResponse<DistributionResponseType>
> => {
  return callAPIWithToken({
    url: `/api/distribution_channel/`,
    method: 'get',
  })
}
const adjustInstock = (data: AdjustInstockType): Promise<AxiosResponse> => {
  return callAPIWithToken({
    url: `/api/supplier/product/adjust-stock/`,
    method: 'put',
    data: data,
  })
}

const getProductDetailWithVariant = (
  index: number,
  dc_id: number
): Promise<AxiosResponse<ProductDetailWithVariantResponseType>> => {
  return callAPIWithToken({
    url: `/api/marketplace/products/${index}/?dc_id=${dc_id}`,
    method: 'get',
  })
}

export {
  addToCart,
  adjustInstock,
  getDistribution,
  getDistributionChannelOfProduct,
  getProductDetailWithVariant,
  getRelatedProduct,
  getWareHouse,
  putWishList,
}
