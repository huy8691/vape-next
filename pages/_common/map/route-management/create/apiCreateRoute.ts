import { AxiosResponse } from 'axios'
import { callAPIWithToken } from 'src/services/jwt-axios'

const createRoute = (data: {
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
}): Promise<AxiosResponse> => {
  return callAPIWithToken({
    url: `/api/travel-scheduling/`,
    method: 'post',
    data: data,
  })
}

export { createRoute }
