import { AxiosResponse } from 'axios'
import { callAPIWithToken } from 'src/services/jwt-axios'
import {
  CreateActivityLogsType,
  ListActivityDataResponseType,
  UpdateActivityLogsType,
} from './activityModel'

const getActivityLogAPI = (
  id: number,
  params?: object
): Promise<AxiosResponse<ListActivityDataResponseType>> => {
  console.log('params', params)
  return callAPIWithToken({
    url: `/api/organization/${id}/activity-log/`,
    method: 'get',
    params: params,
  })
}

const deleteActivityLogAPI = (id: number): Promise<AxiosResponse> => {
  return callAPIWithToken({
    url: `/api/activity-log-of-organization/${id}/`,
    method: 'delete',
  })
}

const createActivityLogAPI = (
  id: number,
  data?: CreateActivityLogsType
): Promise<AxiosResponse> => {
  return callAPIWithToken({
    url: `/api/organization/${id}/activity-log/`,
    method: 'POST',
    data: data,
  })
}

const updateActivityLogAPI = (
  id: number,
  data?: UpdateActivityLogsType
): Promise<AxiosResponse> => {
  return callAPIWithToken({
    url: `/api/activity-log-of-organization/${id}/`,
    method: 'PUT',
    data: data,
  })
}

export {
  getActivityLogAPI,
  deleteActivityLogAPI,
  updateActivityLogAPI,
  createActivityLogAPI,
}
