import { AxiosResponse } from 'axios'
import { callAPIWithToken } from 'src/services/jwt-axios'
import { manuResponseTypeData, manuTypeData } from './modelUpdateDetail'
import { platform } from 'src/utils/global.utils'

const getManufacturerDetail = (
  id: number
): Promise<AxiosResponse<manuResponseTypeData>> => {
  const urlAPI: {
    [key: string]: string
  } = {
    RETAILER: `/api/merchant/manufacturers/${id}`,
    SUPPLIER: `/api/manufacturers/${id}`,
  }
  return callAPIWithToken({
    url: urlAPI[platform()],
    method: 'get',
  })
}
export const putManufacturers = (
  value: manuTypeData,
  id: number
): Promise<AxiosResponse> => {
  const urlAPI: {
    [key: string]: string
  } = {
    RETAILER: `/api/merchant/manufacturers/${id}/`,
    SUPPLIER: `/api/manufacturers/${id}/`,
  }
  return callAPIWithToken({
    url: urlAPI[platform()],
    method: 'put',
    data: {
      logo: value.logo,
      name: value.name,
    },
  })
}
export { getManufacturerDetail }
