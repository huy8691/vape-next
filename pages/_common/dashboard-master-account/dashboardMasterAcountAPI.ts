import { AxiosResponse } from 'axios'
import { SummaryResponseType } from './dashboardMasterAcountModels'
import { callAPIWithToken } from 'src/services/jwt-axios'
import { platform } from 'src/utils/global.utils'

export const getReportSummaryRevenue = (params: {
  fromDate: string
  toDate: string
  type?: string
}): Promise<AxiosResponse<SummaryResponseType>> => {
  const urlAPI: {
    [key: string]: string
  } = {
    RETAILER: `api/report/master/revenue`,
    SUPPLIER: `api/report/master/revenue`,
  }
  return callAPIWithToken({
    url: urlAPI[platform()],
    method: 'get',
    params: params,
  })
}
