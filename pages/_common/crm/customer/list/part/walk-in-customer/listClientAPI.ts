import { AxiosResponse } from 'axios'
import {
  callAPI,
  callAPIUpLoad,
  callAPIWithToken,
} from 'src/services/jwt-axios'
import {
  FileListType,
  ListClientResponseType,
  OCRLicenseResponseType,
  SubmitClientType,
  UrlUploadResponseType,
} from './clientListModel'

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
const readLicense = (
  data: FormData
): Promise<AxiosResponse<OCRLicenseResponseType>> => {
  return callAPIWithToken({
    url: `/api/read-license/`,
    method: 'post',
    data: data,
  })
}
const getUrlUploadFileApi = (data: FileListType): Promise<AxiosResponse> => {
  return callAPI({
    url: '/api/uploads/',
    method: 'post',
    data: data,
  })
}

const uploadFileApi = (
  data: any
): Promise<AxiosResponse<UrlUploadResponseType>> => {
  return callAPIUpLoad({
    url: data.url,
    method: 'post',
    data: data.formData,
  })
}
export {
  getListClient,
  createClient,
  updateClient,
  deleteClient,
  readLicense,
  getUrlUploadFileApi,
  uploadFileApi,
}
