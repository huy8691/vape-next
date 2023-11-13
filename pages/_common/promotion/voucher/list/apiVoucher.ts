import { AxiosResponse } from 'axios'
import { callAPIWithToken } from 'src/services/jwt-axios'
import { ListVoucherDataType } from './modelVoucher'

const getListVoucher = (
  params?: object
): Promise<AxiosResponse<ListVoucherDataType>> => {
  return callAPIWithToken({
    url: `/api/voucher/`,
    method: 'get',
    params: { ...params },
  })
}

export { getListVoucher }
