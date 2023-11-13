import { AxiosResponse } from 'axios'
import { callAPIWithToken } from 'src/services/jwt-axios'
import { BannerResponseType } from './bannerModel'

export const getListBanner = (): Promise<AxiosResponse<BannerResponseType>> => {
  return callAPIWithToken({
    url: `/api/banners/`,
    method: 'get',
  })
}
