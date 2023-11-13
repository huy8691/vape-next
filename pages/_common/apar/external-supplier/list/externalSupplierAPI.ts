import { AxiosResponse } from 'axios'
import { callAPIWithToken } from 'src/services/jwt-axios'

export const getListExternalSupplier = (
  params?: object
): Promise<AxiosResponse> => {
  return callAPIWithToken({
    url: '/api/external-supplier/',
    method: 'get',
    params: {
      ...params,
    },
  })
}
export const deleteExternalSupplier = (
  supplier_id: number
): Promise<AxiosResponse> => {
  return callAPIWithToken({
    url: `/api/external-supplier/${supplier_id}/`,
    method: 'delete',
  })
}
