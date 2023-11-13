import { AxiosResponse } from 'axios'
import { callAPIWithToken } from 'src/services/jwt-axios'
import { AddBrandType } from './brandModel'
import { platform } from 'src/utils/global.utils'

const addBrand = (
  values: AddBrandType
): Promise<AxiosResponse<AddBrandType>> => {
  const urlAPI: {
    [key: string]: string
  } = {
    RETAILER: `/api/merchant/brands/`,
    SUPPLIER: `/api/brands/`,
  }
  return callAPIWithToken({
    url: urlAPI[platform()],
    method: 'POST',
    data: values,
  })
}

export { addBrand }
