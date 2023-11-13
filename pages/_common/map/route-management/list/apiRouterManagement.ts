import { AxiosResponse } from 'axios'
import { callAPIWithToken } from 'src/services/jwt-axios'
import { RouterListResponseType } from './modelRouterManagement'

const getListOfRoute = (
  params?: object
): Promise<AxiosResponse<RouterListResponseType>> => {
  return callAPIWithToken({
    url: `/api/travel-scheduling/`,
    method: 'get',
    params: { ...params },
  })
}

const deleteRouter = (id: number): Promise<AxiosResponse> => {
  return callAPIWithToken({
    url: `/api/travel-scheduling/${id}/`,
    method: 'delete',
  })
}
export { getListOfRoute, deleteRouter }
