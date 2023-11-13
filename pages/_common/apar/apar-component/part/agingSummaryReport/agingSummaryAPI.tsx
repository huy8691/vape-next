import { AxiosResponse } from 'axios'
import { callAPIWithToken } from 'src/services/jwt-axios'
import { platform } from 'src/utils/global.utils'
import {
  ExportResponseType,
  ListSupplierRetailerResponseType,
  SummarayResponseType,
} from './agingSummaryModel'

const getReportPayableAgingSummary = (
  params: object
): Promise<AxiosResponse<SummarayResponseType>> => {
  const urlAPI: {
    [key: string]: string
  } = {
    RETAILER: `/api/report/aging/payable/summary/`,
    SUPPLIER: `/api/report/aging/receivable/summary/`,
  }
  return callAPIWithToken({
    url: urlAPI[platform()],
    method: 'get',
    params: { ...params },
  })
}
const exportAgingSummary = (
  params: object
): Promise<AxiosResponse<ExportResponseType>> => {
  return callAPIWithToken({
    url: `/api/report/aging/payable/transaction/`,
    method: 'get',
    params: { ...params },
  })
}
//uppercase
const getListSupplierRetailer = (
  type: string
): Promise<AxiosResponse<ListSupplierRetailerResponseType>> => {
  return callAPIWithToken({
    url: `/api/organization/filter/apar/?type=${type}`,
    method: 'get',
  })
}
export {
  getReportPayableAgingSummary,
  exportAgingSummary,
  getListSupplierRetailer,
}
