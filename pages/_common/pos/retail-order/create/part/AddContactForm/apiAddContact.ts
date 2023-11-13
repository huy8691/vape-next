import { AxiosResponse } from 'axios'
import {
  callAPI,
  callAPIUpLoad,
  callAPIWithToken,
} from 'src/services/jwt-axios'
import {
  ContactDetailResponseType,
  ContactDetailType,
  FileListType,
  ReadLicenseTypeResponse,
  UrlUploadResponseType,
} from './addContactFormModel'

export const getContactInformation = (
  phone_number: string
): Promise<AxiosResponse<ContactDetailResponseType>> => {
  return callAPIWithToken({
    url: `api/get-client-by-phone-number/${phone_number}/`,
    method: 'get',
  })
}

export const createGuestInformation = (
  value: ContactDetailType
): Promise<AxiosResponse<ContactDetailResponseType>> => {
  return callAPIWithToken({
    url: `api/clients/`,
    method: 'post',
    data: value,
  })
}
export const readLicense = (
  value: FormData
): Promise<AxiosResponse<ReadLicenseTypeResponse>> => {
  return callAPIWithToken({
    url: `/api/read-license/`,
    method: 'post',
    data: value,
  })
}

export const getUrlUploadFileApi = (
  data: FileListType
): Promise<AxiosResponse> => {
  return callAPI({
    url: '/api/uploads/',
    method: 'post',
    data: data,
  })
}

export const uploadFileApi = (
  data: any
): Promise<AxiosResponse<UrlUploadResponseType>> => {
  return callAPIUpLoad({
    url: data.url,
    method: 'post',
    data: data.formData,
  })
}
