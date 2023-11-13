import { AxiosResponse } from 'axios'
import { callAPIWithToken } from 'src/services/jwt-axios'
import {
  ListCarrierResponseType,
  UpdateCarrierStatusType,
} from './shippingCarrierModel'

const getListCarrierConfiguration = (
  params?: object
): Promise<AxiosResponse<ListCarrierResponseType>> => {
  return callAPIWithToken({
    url: '/api/carriers/organization/list/',
    method: 'GET',
    params: {
      ...params,
    },
  })
}
const updateCarrierConfiguration = (
  data: UpdateCarrierStatusType
): Promise<AxiosResponse> => {
  return callAPIWithToken({
    url: '/api/carriers/organization/',
    method: 'PUT',
    data: data,
  })
}
export { getListCarrierConfiguration, updateCarrierConfiguration }
