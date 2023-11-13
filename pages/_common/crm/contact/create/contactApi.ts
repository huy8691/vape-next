import { AxiosResponse } from 'axios'
import { callAPIWithToken } from 'src/services/jwt-axios'
import { SingleChoiceDataResponseType } from '../detail/modelContactDetail'
import { Contact } from './contactModel'

export const createContact = (
  data: Contact
): Promise<AxiosResponse<Contact>> => {
  return callAPIWithToken({
    url: `/api/contact/`,
    method: 'post',
    data: data,
  })
}

export const getSourceApi = (): Promise<AxiosResponse> => {
  return callAPIWithToken({
    url: '/api/source/',
    method: 'get',
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
