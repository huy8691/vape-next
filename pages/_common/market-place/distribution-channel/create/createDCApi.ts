import { AxiosResponse } from 'axios'
import { callAPIWithToken } from 'src/services/jwt-axios'
import {
  CreateChannelDataResponseType,
  DCDataType,
  DetailMerchantChannelResponseType,
} from './modalCreateDC'

const createChannelApi = (
  data: DCDataType
): Promise<AxiosResponse<CreateChannelDataResponseType>> => {
  return callAPIWithToken({
    url: `/api/distribution_channel/`,
    method: 'POST',
    data: data,
  })
}

const updateChannelApi = (
  id: number,
  data: DCDataType
): Promise<AxiosResponse<CreateChannelDataResponseType>> => {
  return callAPIWithToken({
    url: `/api/distribution_channel/${id}/`,
    method: 'PUT',
    data: data,
  })
}

const getDetailDistributionChannel = (
  distribution_channel_id: number
): Promise<AxiosResponse<DetailMerchantChannelResponseType>> => {
  return callAPIWithToken({
    url: `/api/distribution_channel/${distribution_channel_id}/`,
    method: 'GET',
  })
}

export { createChannelApi, updateChannelApi, getDetailDistributionChannel }
