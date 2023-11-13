import { AxiosResponse } from 'axios'
import { callAPI } from 'src/services/jwt-axios'
import {
  GetFindUsOverResponseType,
  MonthlyPurchaseResponseType,
  MonthlySaleResponseType,
  TypeOfSaleResponseType,
} from './modelConvertContact'
// api for convert contact to retailer
const getMonthlyPurchaseApi = (): Promise<
  AxiosResponse<MonthlyPurchaseResponseType>
> => {
  return callAPI({
    url: '/api/monthly-purchase/',
    method: 'get',
  })
}

const getMonthlySaleApi = (): Promise<
  AxiosResponse<MonthlySaleResponseType>
> => {
  return callAPI({
    url: '/api/monthly-sale/',
    method: 'get',
  })
}

const getTypeOfSaleApi = (): Promise<AxiosResponse<TypeOfSaleResponseType>> => {
  return callAPI({
    url: '/api/type-of-sale/',
    method: 'get',
  })
}

const getFindUsOverApi = (): Promise<
  AxiosResponse<GetFindUsOverResponseType>
> => {
  return callAPI({
    url: '/api/find-us-over/',
    method: 'get',
  })
}

export {
  getMonthlyPurchaseApi,
  getMonthlySaleApi,
  getTypeOfSaleApi,
  getFindUsOverApi,
}
