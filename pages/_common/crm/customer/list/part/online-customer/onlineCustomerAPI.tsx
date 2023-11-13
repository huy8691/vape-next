import { AxiosResponse } from 'axios'
import { callAPIWithToken } from 'src/services/jwt-axios'
import { ListOnlineCustomerResponseType } from './modelOnlineCustomer'

const getListCustomer = (
  params?: object
): Promise<AxiosResponse<ListOnlineCustomerResponseType>> => {
  return callAPIWithToken({
    url: `/api/online-customers/`,
    method: 'get',
    params: {
      ...params,
      limit: 15,
    },
  })
}

export { getListCustomer }
