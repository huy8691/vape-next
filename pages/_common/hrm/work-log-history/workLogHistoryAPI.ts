import { AxiosResponse } from 'axios'

import { callAPIWithToken } from 'src/services/jwt-axios'

const getListWorkLogHistory = (query: object): Promise<AxiosResponse> => {
  return callAPIWithToken({
    url: `/api/organization/work-log/`,
    method: 'get',
    params: query,
  })
}

const doExportExcel = (query: object): Promise<AxiosResponse> => {
  return callAPIWithToken({
    url: `/api/work-log/export/`,
    method: 'post',
    params: query,
  })
}

export { getListWorkLogHistory, doExportExcel }
