import { AxiosResponse } from 'axios'
import { callAPI } from 'src/services/jwt-axios'
import { VerifySupplierType } from './verifySupplierModel'

export const verifySupplier = (
  data: VerifySupplierType
): Promise<AxiosResponse> => {
  return callAPI({
    url: `/api/admin/supplier-request/accept-or-reject-by-email/`,
    method: 'post',
    data: data,
  })
}
