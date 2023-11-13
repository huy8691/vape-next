import { AxiosResponse } from 'axios'
import { callAPIWithToken } from 'src/services/jwt-axios'

const getOrganizationSettings = (): Promise<AxiosResponse> => {
  return callAPIWithToken({
    url: `/api/organization/settings/`,
    method: 'get',
  })
}

const updateWorkLogConfig = (value: number): Promise<AxiosResponse> => {
  return callAPIWithToken({
    url: `/api/organization/settings/`,
    method: 'put',
    data: {
      limit_hour: value,
    },
  })
}

export { getOrganizationSettings, updateWorkLogConfig }
