import { AxiosResponse } from 'axios'
import { callAPIWithToken } from 'src/services/jwt-axios'
import {
  CreateMessageResponseType,
  CreateMessageType,
  ListClientResponseType,
  ListContactResponseType,
  ListMessageResponseType,
  RetailerDataResponseType,
  SendNMessageType,
} from './messageModel'
import { UpdateMessageType } from '../detail/messageDetailModel'

const getListMessage = (
  params?: object
): Promise<AxiosResponse<ListMessageResponseType>> => {
  return callAPIWithToken({
    url: `/api/organization/notifi-messages/`,
    method: 'get',
    params: {
      ...params,
    },
  })
}
const createMessage = (
  data: CreateMessageType
): Promise<AxiosResponse<CreateMessageResponseType>> => {
  return callAPIWithToken({
    url: `/api/organization/notifi-messages/`,
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
export {
  getListMessage,
  createMessage,
  updateMessage,
  deleteMessage,
  sendMessage,
  getRetailerList,
  getLeadList,
  getListCustomer,
}
