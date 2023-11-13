import { AxiosResponse } from 'axios'
import { callAPIWithToken } from 'src/services/jwt-axios'
import {
  AddBrandType,
  BrandDetailResponseType,
  brandResponseTypeData,
} from './modelBrand'
import { platform } from 'src/utils/global.utils'

const getListBrand = (
  params?: object
): Promise<AxiosResponse<brandResponseTypeData>> => {
  const urlAPI: {
    [key: string]: string
  } = {
    RETAILER: `/api/merchant/brands/`,
    SUPPLIER: `/api/brands/`,
  }
  return callAPIWithToken({
    url: urlAPI[platform()],
    method: 'GET',
    params: {
      ...params,
    },
  })
}

const getBrandDetail = (
  id: number
): Promise<AxiosResponse<BrandDetailResponseType>> => {
  const urlAPI: {
    [key: string]: string
  } = {
    RETAILER: `/api/merchant/brands/${id}/`,
    SUPPLIER: `/api/brands/${id}/`,
  }
  return callAPIWithToken({
    url: urlAPI[platform()],
    method: 'get',
  })
}

const addBrand = (
  values: AddBrandType
): Promise<AxiosResponse<brandResponseTypeData>> => {
  const urlAPI: {
    [key: string]: string
  } = {
    RETAILER: `/api/merchant/brands/`,
    SUPPLIER: `/api/brands/`,
  }
  return callAPIWithToken({
    url: urlAPI[platform()],
    method: 'POST',
    data: values,
  })
}
const deleteBrand = (
  id?: number
): Promise<AxiosResponse<brandResponseTypeData>> => {
  const urlAPI: {
    [key: string]: string
  } = {
    RETAILER: `/api/merchant/brands/${id}/`,
    SUPPLIER: `/api/brands/${id}/`,
  }
  return callAPIWithToken({
    url: urlAPI[platform()],
    method: 'Delete',
  })
}
const updateBrand = (
  value: AddBrandType,
  id?: string | string[]
): Promise<AxiosResponse> => {
  const urlAPI: {
    [key: string]: string
  } = {
    RETAILER: `/api/merchant/brands/${id}/`,
    SUPPLIER: `/api/brands/${id}/`,
  }
  return callAPIWithToken({
    url: urlAPI[platform()],
    method: 'put',
    data: value,
  })
}

export { getListBrand, addBrand, deleteBrand, getBrandDetail, updateBrand }
