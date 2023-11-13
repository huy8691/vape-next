import { AxiosResponse } from 'axios'
import { callAPIWithToken } from 'src/services/jwt-axios'
import { platform } from 'src/utils/global.utils'
import {
  AgingDetailResponseType,
  ExportResponseType,
  ListSupplierRetailerResponseType,
} from './agingDetailModel'

const getReportPayableAgingDetail = (
  params: object
): Promise<AxiosResponse<AgingDetailResponseType>> => {
  const urlAPI: {
    [key: string]: string
  } = {
    RETAILER: `/api/report/aging/payable/detail/`,
    SUPPLIER: `/api/report/aging/receivable/detail/`,
  }
  return callAPIWithToken({
    url: urlAPI[platform()],
    method: 'get',
    params: { ...params },
  })
}
const exportReport = (
  params: object
): Promise<AxiosResponse<ExportResponseType>> => {
  return callAPIWithToken({
    url: `/api/report/aging/payable/detail/`,
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

export { getReportPayableAgingDetail, exportReport, getListSupplierRetailer }
