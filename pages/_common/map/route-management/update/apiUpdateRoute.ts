import { AxiosResponse } from 'axios'
import { callAPIWithToken } from 'src/services/jwt-axios'
import { RouteDetailResponseType } from './modelUpdateRoute'

export const getDetailRoute = (
  index: number
): Promise<AxiosResponse<RouteDetailResponseType>> => {
  return callAPIWithToken({
    url: `/api/travel-scheduling/${index}/`,
    method: 'get',
  })
}

const updateRoute = (
  id: number,
  data: {
    seller_id: number
    name: string
    desc: string
    date_from: string
    date_to: string
    origin: string
    destination: string
    optimize: boolean
    locations: {
      address: string
      latitude: string
      longitude: string
      contact: number | null
    }[]
    destination_location: {
      latitude: string
      longitude: string
    }
    origin_location: {
      latitude: string
      longitude: string
    }
  }
): Promise<AxiosResponse> => {
  return callAPIWithToken({
    url: `/api/travel-scheduling/${id}/`,
    method: 'put',
    data: data,
  })
}

export { updateRoute }
