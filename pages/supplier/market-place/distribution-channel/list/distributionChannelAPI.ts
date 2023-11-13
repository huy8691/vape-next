import { AxiosResponse } from 'axios'
import { callAPIWithToken } from 'src/services/jwt-axios'
import { DistributionChannelListResponseType } from './distributionChannelModel'

export const getListDistributionChannel = (
  params: object | null
): Promise<AxiosResponse<DistributionChannelListResponseType>> => {
  return callAPIWithToken({
    url: `/api/distribution_channel/`,
    method: 'get',
    params: {
      ...params,
    },
  })
}

export const deleteManufacturer = (
  id: number | undefined
): Promise<AxiosResponse> => {
  return callAPIWithToken({
    url: `/api/manufacturers/${id}/`,
    method: 'delete',
  })
}
