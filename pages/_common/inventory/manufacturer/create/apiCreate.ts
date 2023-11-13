import { AxiosResponse } from 'axios'
import { callAPIWithToken } from 'src/services/jwt-axios'
import { AddManufactureType } from './modelCreate'
import { platform } from 'src/utils/global.utils'

export const postManufacturers = (
  value: AddManufactureType
): Promise<AxiosResponse> => {
  const urlAPI: {
    [key: string]: string
  } = {
    RETAILER: `/api/merchant/manufacturers/`,
    SUPPLIER: `/api/manufacturers/`,
  }
  return callAPIWithToken({
    url: urlAPI[platform()],
    method: 'post',
    data: value,
  })
}
