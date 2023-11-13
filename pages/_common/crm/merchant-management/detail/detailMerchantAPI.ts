import { AxiosResponse } from 'axios'
import { callAPIWithToken } from 'src/services/jwt-axios'
import {
  AttachmentsDataResponseType,
  MerchantDataResponseType,
} from './merchantModel'

const getMerchantDetailAPI = (
  Id?: number
): Promise<AxiosResponse<MerchantDataResponseType>> => {
  console.log('6666', Id)
  return callAPIWithToken({
    url: `/api/organization-detail/${Id}/`,
    method: 'get',
  })
}

const getListAttachmentApi = (
  id?: number
): Promise<AxiosResponse<AttachmentsDataResponseType>> => {
  return callAPIWithToken({
    url: `/api/organization/${id}/attachments/`,
  })
}

export { getMerchantDetailAPI, getListAttachmentApi }
