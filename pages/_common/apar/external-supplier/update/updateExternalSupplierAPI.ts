import { AxiosResponse } from 'axios'
import { callAPIWithToken } from 'src/services/jwt-axios'
import { ExternalSupplierTypeData } from '../list/externalSupplierModel'

export const updateExternalSupplier = (
  data: {
    name: string
  },
  supplier_id?: number
): Promise<AxiosResponse> => {
  return callAPIWithToken({
    url: `/api/external-supplier/${supplier_id}/`,
    method: 'put',
    data,
  })
}

export const getDetailExternalSupplier = (
  supplier_id?: number
): Promise<AxiosResponse<{ data: ExternalSupplierTypeData }>> => {
  return callAPIWithToken({
    url: `/api/external-supplier/${supplier_id}/`,
    method: 'get',
  })
}
