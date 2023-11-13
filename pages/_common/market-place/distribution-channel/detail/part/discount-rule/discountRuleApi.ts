import { AxiosResponse } from 'axios'
import { callAPIWithToken } from 'src/services/jwt-axios'
import {
  DiscountOfDCResponseType,
  ListDiscountOfDCResponseType,
  ListDiscountSpecificProductForChannelType,
  ListProductForAppplyDCResponseType,
  SubmitDiscountForChannelType,
  SubmitDiscountForSpecificProductType,
  VariantDetailResponseType,
} from './discountRuleModel'

const createDiscountForChannel = (
  data: SubmitDiscountForChannelType
): Promise<AxiosResponse> => {
  return callAPIWithToken({
    url: `/api/discount/distribution-channel/`,
    method: 'post',
    data: data,
  })
}
const updateDiscountForChannel = (
  id: number,
  data: SubmitDiscountForChannelType
): Promise<AxiosResponse> => {
  return callAPIWithToken({
    url: `/api/discount/detail/${id}/`,
    method: 'put',
    data: data,
  })
}
const getDetailDiscountForChannel = (
  id: number
): Promise<AxiosResponse<DiscountOfDCResponseType>> => {
  return callAPIWithToken({
    url: `/api/discount/detail/${id}/`,
    method: 'get',
  })
}
const createDiscountForSpecificProduct = (
  id: number,
  data: SubmitDiscountForSpecificProductType
): Promise<AxiosResponse> => {
  return callAPIWithToken({
    url: `/api/discount/distribution-channel/${id}/specific-products/`,
    method: 'post',
    data: data,
  })
}
const getListDiscountSpecificProductInDc = (
  id: number
): Promise<AxiosResponse<ListDiscountSpecificProductForChannelType>> => {
  return callAPIWithToken({
    url: `/api/discount/distribution-channel/${id}/specific-products/`,
    method: 'get',
  })
}
const getListDiscountOfDC = (
  id: number
): Promise<AxiosResponse<ListDiscountOfDCResponseType>> => {
  return callAPIWithToken({
    url: `/api/discount/distribution-channel/${id}/list/`,
    method: 'get',
  })
}
const deleteDiscountOfDC = (id: number): Promise<AxiosResponse> => {
  return callAPIWithToken({
    url: `/api/discount/detail/${id}/`,
    method: 'delete',
  })
}
const getListProductApplyOnDC = (
  id: number,
  params?: object
): Promise<AxiosResponse<ListProductForAppplyDCResponseType>> => {
  return callAPIWithToken({
    url: `/api/products/distribution-channel/${id}/discount/`,
    method: 'get',
    params: { ...params },
  })
}
const getDetailVariant = (
  variant_id: number,
  dc_id: number
): Promise<AxiosResponse<VariantDetailResponseType>> => {
  return callAPIWithToken({
    url: `/api/products/${variant_id}/distribution-channel/${dc_id}/discount/`,
    method: 'get',
  })
}
export {
  createDiscountForChannel,
  getListDiscountSpecificProductInDc,
  getListProductApplyOnDC,
  getDetailVariant,
  createDiscountForSpecificProduct,
  getListDiscountOfDC,
  deleteDiscountOfDC,
  updateDiscountForChannel,
  getDetailDiscountForChannel,
}
