import { AxiosResponse } from 'axios'
import { callAPIWithToken } from 'src/services/jwt-axios'
import {
  AddChannelDatatResponsiveType,
  ChannelDataType,
} from './addChannelModel'

const AddChannelApi = (
  data?: ChannelDataType
): Promise<AxiosResponse<AddChannelDatatResponsiveType>> => {
  console.log('getcode', data?.code)
  return callAPIWithToken({
    url: `/api/merchant/join/distribution/`,
    method: 'POST',
    data: data,
  })
}

export { AddChannelApi }
