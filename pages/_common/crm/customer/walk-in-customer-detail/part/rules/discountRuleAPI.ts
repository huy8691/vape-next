import { AxiosResponse } from 'axios'
import { callAPIWithToken } from 'src/services/jwt-axios'
import {
  DiscountOfDCResponseType,
  ListDiscountOfDCResponseType,
  ListDiscountSpecificProductForChannelType,
  ListProductForAppplyDCResponseType,
  SubmitDiscountForChannelType,
  SubmitDiscountForSpecificProductType,
  SubmitUpdateDiscountForSpecificProductType,
  VariantDetailResponseType,
} from './discountRuleModel'

const createDiscountForChannel = (
  data: SubmitDiscountForChannelType
): Promise<AxiosResponse> => {
  return callAPIWithToken({
    url: `/api/discount/client/`,
    method: 'post',
    data: data,
  })
}
const updateDiscountForChannel = (
  id: number,
  data: SubmitUpdateDiscountForSpecificProductType
): Promise<AxiosResponse> => {
  return callAPIWithToken({
    url: `/api/discount/client/${id}/`,
    method: 'put',
    data: data,
  })
}
const getDetailDiscountForChannel = (
  id: number
): Promise<AxiosResponse<DiscountOfDCResponseType>> => {
  return callAPIWithToken({
    url: `/api/discount/client/${id}/`,
    method: 'get',
  })
}
const createDiscountForSpecificProduct = (
  data: SubmitDiscountForSpecificProductType
): Promise<AxiosResponse> => {
  return callAPIWithToken({
    url: `/api/discount/client/`,
    method: 'post',
    data: data,
  })
}
const getListDiscountSpecificProductInDc = (
  id: number
): Promise<AxiosResponse<ListDiscountSpecificProductForChannelType>> => {
  return callAPIWithToken({
    url: `/api/discount/client/${id}/list/?is_general=false`,
    method: 'get',
  })
}
const getListDiscountOfCustomer = (
  id: number
): Promise<AxiosResponse<ListDiscountOfDCResponseType>> => {
  return callAPIWithToken({
    url: `/api/discount/client/${id}/list/?is_general=True`,
    method: 'get',
  })
}
const deleteDiscountOfDC = (id: number): Promise<AxiosResponse> => {
  return callAPIWithToken({
    url: `/api/discount/client/${id}/`,
    method: 'delete',
  })
}
const getListProductApplyOnDC = (
  params?: object
): Promise<AxiosResponse<ListProductForAppplyDCResponseType>> => {
  return callAPIWithToken({
    url: `/api/merchant/sale/products/`,
    method: 'get',
    params: { ...params },
  })
}
const getDetailVariant = (
  variant_id: number
): Promise<AxiosResponse<VariantDetailResponseType>> => {
  return callAPIWithToken({
    url: `/api/inventory/products/${variant_id}`,
    method: 'get',
  })
}
export {
  createDiscountForChannel,
  getListDiscountSpecificProductInDc,
  getListProductApplyOnDC,
  getDetailVariant,
  createDiscountForSpecificProduct,
  getListDiscountOfCustomer,
  deleteDiscountOfDC,
  updateDiscountForChannel,
  getDetailDiscountForChannel,
}
