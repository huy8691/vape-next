import { AxiosResponse } from 'axios'
import { callAPIWithToken } from 'src/services/jwt-axios'
import { ListClientResponseType, SubmitClientType } from './clientListModel'

const getListClient = (
  params?: object
): Promise<AxiosResponse<ListClientResponseType>> => {
  return callAPIWithToken({
    url: `/api/clients/`,
    method: 'get',
    params: {
      ...params,
      limit: 15,
    },
  })
}
const createClient = (
  data: SubmitClientType
): Promise<AxiosResponse<ListClientResponseType>> => {
  return callAPIWithToken({
    url: `/api/clients/`,
    method: 'post',
    data: data,
  })
}
const updateClient = (
  data: SubmitClientType,
  index: number
): Promise<AxiosResponse> => {
  return callAPIWithToken({
    url: `/api/clients/${index}/`,
    method: 'put',
    data: data,
  })
}
const deleteClient = (index: number): Promise<AxiosResponse> => {
  return callAPIWithToken({
    url: `/api/clients/${index}/`,
    method: 'delete',
  })
}

export { getListClient, createClient, updateClient, deleteClient }
