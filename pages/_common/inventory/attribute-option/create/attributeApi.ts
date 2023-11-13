import { AxiosResponse } from 'axios'
import { callAPIWithToken } from 'src/services/jwt-axios'
import { AttributeType } from './attributeModel'

const createAttribute = (data: AttributeType): Promise<AxiosResponse> => {
  return callAPIWithToken({
    url: '/api/attributes/',
    method: 'POST',
    data: data,
  })
}

export { createAttribute }
