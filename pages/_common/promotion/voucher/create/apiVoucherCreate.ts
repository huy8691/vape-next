import { AxiosResponse } from 'axios'
import { callAPIWithToken } from 'src/services/jwt-axios'
import { ProductSpecificDataType } from '../part/rules/specificProduct/modalSpecificProduct'

const getListProductSpecific = (
  params: object
): Promise<AxiosResponse<ProductSpecificDataType>> => {
  return callAPIWithToken({
    url: `/api/products-to-set-specific-products-for-voucher/`,
    method: 'get',
    params,
  })
}

const createVoucherProductSpecific = (data: any): Promise<AxiosResponse> => {
  return callAPIWithToken({
    url: `/api/voucher/`,
    method: 'post',
    data,
  })
}

const getGeneralVoucherCode = (): Promise<AxiosResponse> => {
  return callAPIWithToken({
    url: `/api/voucher/generate-code/`,
    method: 'get',
  })
}

export {
  getListProductSpecific,
  getGeneralVoucherCode,
  createVoucherProductSpecific,
}
