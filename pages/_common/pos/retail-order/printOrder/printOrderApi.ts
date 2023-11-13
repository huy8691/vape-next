import { AxiosResponse } from 'axios'

import { callAPIWithToken } from 'src/services/jwt-axios'

const getBusinessProfile = (): Promise<
  AxiosResponse<{
    data: {
      logo: string
      business_name: string
      address: string
    }
    error?: any
  }>
> => {
  return callAPIWithToken({
    url: `/api/business-profile/`,
    method: 'get',
  })
}

export { getBusinessProfile }
