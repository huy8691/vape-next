import { AxiosResponse } from 'axios'
import { callAPIWithToken } from 'src/services/jwt-axios'
import {
  ListManufacturerResponseType,
  SupplierResponseType,
  ProductCategoryOnMarketPlaceResponseType,
} from './featuredModel'

const getListManufacturer = (): Promise<
  AxiosResponse<ListManufacturerResponseType>
> => {
  return callAPIWithToken({
    url: `/api/admin/organizations/?is_manufacturer=True`,
    method: 'get',
  })
}
const getSupplier = (): Promise<AxiosResponse<SupplierResponseType>> => {
  return callAPIWithToken({
    url: `/api/organizations/`,
    method: 'get',
  })
}

const getProductCategoryOnMarketPlace = (
  params?: object
): Promise<AxiosResponse<ProductCategoryOnMarketPlaceResponseType>> => {
  return callAPIWithToken({
    url: `/api/categories-marketplace/`,
    method: 'get',
    params: params,
  })
}
export { getListManufacturer, getSupplier, getProductCategoryOnMarketPlace }
