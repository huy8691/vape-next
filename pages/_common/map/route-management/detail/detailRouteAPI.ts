import { AxiosResponse } from 'axios'
import { callAPIWithToken } from 'src/services/jwt-axios'
import { RouteDetailResponseType } from './detailRouteModel'

export const getDetailRoute = (
  index: number
): Promise<AxiosResponse<RouteDetailResponseType>> => {
  return callAPIWithToken({
    url: `/api/travel-scheduling/${index}/`,
    method: 'get',
  })
}
