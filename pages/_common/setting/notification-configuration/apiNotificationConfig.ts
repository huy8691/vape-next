import { AxiosResponse } from 'axios'
import { callAPIWithToken } from 'src/services/jwt-axios'
import {
  NotificationDetailResponseType,
  NotificationListDataResponseType,
} from './modelNotificationConfig'

const getListNotificationConfiguration = (): Promise<
  AxiosResponse<NotificationListDataResponseType>
> => {
  return callAPIWithToken({
    url: '/api/notifications/organization-configuration/',
    method: 'get',
    params: {
      limit: 20,
    },
  })
}

const getDetailNotificationConfiguration = (
  id: number
): Promise<AxiosResponse<NotificationDetailResponseType>> => {
  return callAPIWithToken({
    url: `/api/notifications/organization-configuration/${id}/`,
    method: 'get',
  })
}

const doConfigNotification = (
  id: number,
  data: any
): Promise<AxiosResponse> => {
  return callAPIWithToken({
    url: `/api/notifications/organization-configuration/${id}/`,
    method: 'put',
    data,
  })
}

const doAddDeviceToken = (token: string): Promise<AxiosResponse> => {
  return callAPIWithToken({
    url: '/api/notifications/devices/',
    method: 'post',
    data: {
      token,
      platform: 'WEB',
    },
  })
}

const doDeactiveToken = (token: string): Promise<AxiosResponse> => {
  return callAPIWithToken({
    url: '/api/notifications/devices/deactive/',
    method: 'put',
    data: {
      token,
      platform: 'WEB',
    },
  })
}

export {
  getListNotificationConfiguration,
  getDetailNotificationConfiguration,
  doConfigNotification,
  doAddDeviceToken,
  doDeactiveToken,
}
