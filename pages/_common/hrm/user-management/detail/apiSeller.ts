import { AxiosResponse } from 'axios'
import { callAPIWithToken } from 'src/services/jwt-axios'
import { Item } from './sellerModel'

const getWorkShiftOfUser = (userId?: number): Promise<AxiosResponse> => {
  return callAPIWithToken({
    url: `/api/user/${userId}/work-shift/`,
    method: 'get',
  })
}

const updateAllWorkShift = (
  userId: number,
  data: Item[]
): Promise<AxiosResponse> => {
  return callAPIWithToken({
    url: `/api/user/${userId}/update-work-shift/`,
    method: 'put',
    data: {
      items: data,
    },
  })
}

const updateIncome = (
  userId: number,
  id: number,
  data: { type?: string; pay_rate?: number }
): Promise<AxiosResponse> => {
  return callAPIWithToken({
    url: `/api/user/${userId}/income/${id}/`,
    method: 'put',
    data,
  })
}

export { getWorkShiftOfUser, updateAllWorkShift, updateIncome }
