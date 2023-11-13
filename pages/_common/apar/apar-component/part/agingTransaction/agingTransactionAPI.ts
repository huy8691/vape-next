import { AxiosResponse } from 'axios'
import { callAPIWithToken } from 'src/services/jwt-axios'
import { platform } from 'src/utils/global.utils'
import {
  ExportResponseType,
  TransactionDetailResponseType,
} from './agingTransactionModel'

const getReportAgingTransaction = (
  params: object
): Promise<AxiosResponse<TransactionDetailResponseType>> => {
  const urlAPI: {
    [key: string]: string
  } = {
    RETAILER: `/api/report/aging/payable/transaction/`,
    SUPPLIER: `/api/report/aging/receivable/transaction/`,
  }
  return callAPIWithToken({
    url: urlAPI[platform()],
    method: 'get',
    params: { ...params },
  })
}
const exportAgingTransaction = (
  params: object
): Promise<AxiosResponse<ExportResponseType>> => {
  return callAPIWithToken({
    url: `/api/report/aging/payable/transaction/`,
    method: 'get',
    params: { ...params },
  })
}

export { getReportAgingTransaction, exportAgingTransaction }
