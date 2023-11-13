import { AxiosResponse } from 'axios'
import { SellersInsightsResponseType } from './sellersReportModels'
import { callAPIWithToken } from 'src/services/jwt-axios'

export const getSellersInsights = (params: {
  fromDate: string
  toDate: string
}): Promise<AxiosResponse<SellersInsightsResponseType>> => {
  return callAPIWithToken({
    url: `api/report/seller/insights`,
    method: 'get',
    params: params,
  })
}
