import { AxiosResponse } from 'axios'

import { callAPIWithToken } from 'src/services/jwt-axios'

const getListWorkLogHistory = (query: object): Promise<AxiosResponse> => {
  return callAPIWithToken({
    url: `/api/user/work-log/`,
    method: 'get',
    params: query,
  })
}

const createUpdateWorkLogHistory = (data: {
  date: string
  time: string
  description: string
  time_spent: number
  time_str: string
  id?: number | boolean
}): Promise<AxiosResponse> => {
  const { id, ...rest } = data
  return callAPIWithToken({
    url: `/api/work-log/${id ? id + '/' : ''}`,
    method: id ? 'put' : 'post',
    data: { ...rest },
  })
}

const getDetailWorkLogHistory = (workLogId: number): Promise<AxiosResponse> => {
  return callAPIWithToken({
    url: `/api/work-log/${workLogId}`,
    method: 'get',
  })
}

const deleteWorkLogHistory = (workLogId: number): Promise<AxiosResponse> => {
  return callAPIWithToken({
    url: `/api/work-log/${workLogId}/`,
    method: 'delete',
  })
}

const getTotalSpentTime = (): Promise<AxiosResponse> => {
  return callAPIWithToken({
    url: `/api/work-log/total-spent-time/`,
    method: 'get',
  })
}

const getOrganizationSettings = (): Promise<AxiosResponse> => {
  return callAPIWithToken({
    url: `/api/organization/settings/`,
    method: 'get',
  })
}

export {
  getListWorkLogHistory,
  deleteWorkLogHistory,
  createUpdateWorkLogHistory,
  getDetailWorkLogHistory,
  getTotalSpentTime,
  getOrganizationSettings,
}
