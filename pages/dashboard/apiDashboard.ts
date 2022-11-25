import { AxiosResponse } from 'axios'
import { callAPI } from 'src/services/jwt-axios'
import {
  ProductListDataResponseType,
  PromotionListDataResponseType,
  OutstandingFarmListDataResponseType,
} from './modelDashboard'

// list products
const getNewProductList = (): Promise<
  AxiosResponse<ProductListDataResponseType>
> => {
  return callAPI({
    url: `/products/customer?sort=approved_at&order=DESC`,
    method: 'get',
    params: {},
  })
}

const getSellingProductList = (): Promise<
  AxiosResponse<ProductListDataResponseType>
> => {
  return callAPI({
    url: `/products/customer/top/products`,
    method: 'get',
    params: {},
  })
}

const getCategoryProduct = (): Promise<
  AxiosResponse<ProductListDataResponseType>
> => {
  return callAPI({
    url: `/categories?format=TREE`,
    method: 'get',
    params: {},
  })
}

// promotion
const getPromotion = (): Promise<
  AxiosResponse<PromotionListDataResponseType>
> => {
  return callAPI({
    url: `/promotions`,
    method: 'get',
    params: {},
  })
}

// outstanding farm
const getOutstandingFarm = (): Promise<
  AxiosResponse<OutstandingFarmListDataResponseType>
> => {
  return callAPI({
    url: `/suppliers/top/suppliers`,
    method: 'get',
    params: {},
  })
}

export {
  getNewProductList,
  getSellingProductList,
  getCategoryProduct,
  getPromotion,
  getOutstandingFarm,
}
