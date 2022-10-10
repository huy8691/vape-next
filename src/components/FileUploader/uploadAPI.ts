import { AxiosResponse } from 'axios'
import { callAPI } from 'src/services/jwt-axios'
import { FileListType, UrlUploadResponseType } from './uploadModels'

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
  return callAPI({
    url: data.url,
    method: 'post',
    data: data.formData,
  })
}

export { getUrlUploadFileApi, uploadFileApi }
