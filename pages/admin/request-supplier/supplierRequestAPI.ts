import { AxiosResponse } from 'axios'
import { callAPIWithToken } from 'src/services/jwt-axios'
import { SupplierRequestDataResponseType } from './supplierRequestModel'

const getSupplierRequestList = (
  params?: object
): Promise<AxiosResponse<SupplierRequestDataResponseType>> => {
  return callAPIWithToken({
    url: `/api/user/supplier-request/list/`,
    method: 'get',
    params: {
      ...params,
    },
  })
}
const getDetailSupplierRequest = (id: number): Promise<AxiosResponse> => {
  return callAPIWithToken({
    url: `/api/admin/supplier-request/${id}/`,
    method: 'get',
  })
}
const updateStatus = (
  index: number,
  data: {
    status: string
    reasons: string
  }
): Promise<AxiosResponse> => {
  return callAPIWithToken({
    url: `/api/admin/supplier-request/${index}/`,
    method: 'put',
    data: data,
  })
}
export { getSupplierRequestList, getDetailSupplierRequest, updateStatus }
