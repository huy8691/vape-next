import { AxiosResponse } from 'axios'
import { callAPIWithToken } from 'src/services/jwt-axios'
import { ContactUpdateType, SingleChoiceDataResponseType } from './contactModel'

export const getContactDetail = (
  id: number
): Promise<AxiosResponse<ContactUpdateType>> => {
  return callAPIWithToken({
    url: `/api/contact/${id}/`,
    method: 'get',
  })
}
export const updateContact = (
  id: number,
  data: ContactUpdateType
): Promise<AxiosResponse<ContactUpdateType>> => {
  return callAPIWithToken({
    url: `/api/contact/${id}/`,
    method: 'put',
    data,
  })
}
export const getTypeOfLeadApi = (): Promise<
  AxiosResponse<SingleChoiceDataResponseType>
> => {
  return callAPIWithToken({
    url: '/api/type-of-lead/',
    method: 'get',
  })
}
