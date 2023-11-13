import { AxiosResponse } from 'axios'
import { callAPIWithToken } from 'src/services/jwt-axios'
import { notificationHistoryResponseType } from './notificationHistoryModels'

const getNotificationsNotRead = (): Promise<
  AxiosResponse<notificationHistoryResponseType>
> => {
  return callAPIWithToken({
    url: `api/notifications/unread/`,
    method: 'get',
  })
}

export { getNotificationsNotRead }
