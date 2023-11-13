import { AxiosResponse } from 'axios'
import { callAPIWithToken } from 'src/services/jwt-axios'
import {
  ListClientResponseType,
  ListContactResponseType,
  MessageDetailResponseType,
  RetailerDataResponseType,
  SendNMessageType,
  UpdateMessageType,
} from './messageDetailModel'

const getDetailMessage = (
  id: number
): Promise<AxiosResponse<MessageDetailResponseType>> => {
  return callAPIWithToken({
    url: `/api/organization/notifi-messages/${id}/`,
    method: 'get',
  })
}
const getRetailerList = (
  params?: object
): Promise<AxiosResponse<RetailerDataResponseType>> => {
  return callAPIWithToken({
    url: `/api/joined-organizations/`,
    method: 'get',
    params: {
      ...params,
    },
  })
}
const getLeadList = (
  params?: object
): Promise<AxiosResponse<ListContactResponseType>> => {
  return callAPIWithToken({
    url: '/api/contact/',
    method: 'get',
    params: {
      ...params,
    },
  })
}
const getListCustomer = (
  params?: object
): Promise<AxiosResponse<ListClientResponseType>> => {
  return callAPIWithToken({
    url: `/api/clients/`,
    method: 'get',
    params: {
      ...params,
    },
  })
}
const sendMessage = (
  id: number,
  data: SendNMessageType
): Promise<AxiosResponse> => {
  return callAPIWithToken({
    url: `/api/organization/notifi-messages/${id}/notify-client/`,
    method: 'post',
    data: data,
  })
}
const updateMessage = (
  id: number,
  data: UpdateMessageType
): Promise<AxiosResponse> => {
  return callAPIWithToken({
    url: `/api/organization/notifi-messages/${id}/`,
    method: 'put',
    data: data,
  })
}
const deleteMessage = (id: number): Promise<AxiosResponse> => {
  return callAPIWithToken({
    url: `/api/organization/notifi-messages/${id}/`,
    method: 'delete',
  })
}

export {
  getDetailMessage,
  getRetailerList,
  getLeadList,
  getListCustomer,
  sendMessage,
  deleteMessage,
  updateMessage,
}
