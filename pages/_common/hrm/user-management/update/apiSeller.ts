import { AxiosResponse } from 'axios'
import { callAPIWithToken } from 'src/services/jwt-axios'
import { UpdateSellerDataType } from './sellerModel'

const updateSeller = (
  seller_id: number,
  data: UpdateSellerDataType
): Promise<AxiosResponse> => {
  return callAPIWithToken({
    url: `/api/sellers/${seller_id}/`,
    method: 'put',
    data: data,
  })
}
const getDetailSeller = (
  seller_id: number,
  params?: object
): Promise<AxiosResponse> => {
  return callAPIWithToken({
    url: `/api/sellers/${seller_id}`,
    method: 'get',
    params: {
      ...params,
    },
  })
}

export { updateSeller, getDetailSeller }
