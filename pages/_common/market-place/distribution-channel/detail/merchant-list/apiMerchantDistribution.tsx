import { AxiosResponse } from 'axios'
import { callAPIWithToken } from 'src/services/jwt-axios'
import {
  DetailMerchantChannelResponseType,
  ListMerchantDataResponseType,
  ParamsDataType,
} from './modalMerchantDistribution'

const getListMerchantDistribution = (
  params: ParamsDataType
): Promise<AxiosResponse<ListMerchantDataResponseType>> => {
  console.log('call')
  return callAPIWithToken({
    url: `/api/distribution_channels/${params.id}/organizations/`,
    method: 'GET',
    params: { ...params },
  })
}

const deleteMerchantDistribution = (
  id_distribution_organization: number,
  id_dc: number
): Promise<AxiosResponse> => {
  return callAPIWithToken({
    url: `/api/distribution/remove/${id_distribution_organization}/out/${id_dc}`,
    method: 'DELETE',
  })
}

const getDetailDistributionChannel = (
  distribution_channel_id: string | string[]
): Promise<AxiosResponse<DetailMerchantChannelResponseType>> => {
  return callAPIWithToken({
    url: `/api/distribution_channel/${distribution_channel_id}/`,
    method: 'GET',
  })
}

export {
  getListMerchantDistribution,
  deleteMerchantDistribution,
  getDetailDistributionChannel,
}
