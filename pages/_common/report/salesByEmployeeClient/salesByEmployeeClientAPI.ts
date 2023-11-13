import { AxiosResponse } from 'axios'
import { SalesByEmployeeClientResponseType } from './salesByEmployeeClientModels'
import { callAPIWithToken } from 'src/services/jwt-axios'

export const getSalesByEmployeeClient = (params: {
  fromDate: string
  toDate: string
  tab: string
}): Promise<AxiosResponse<SalesByEmployeeClientResponseType>> => {
  return callAPIWithToken({
    url:
      params.tab === 'salesByClients'
        ? `api/report/client`
        : `api/report/employee`,
    method: 'get',
    params: params,
  })
}
