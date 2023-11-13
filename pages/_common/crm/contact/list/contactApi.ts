import { AxiosResponse } from 'axios'
import { callAPIWithToken } from 'src/services/jwt-axios'
import { AddSellerListDataType } from './contactModel'

export const getContactList = (params?: object): Promise<AxiosResponse> => {
  return callAPIWithToken({
    url: '/api/contact',
    method: 'get',
    params: {
      ...params,
    },
  })
}
export const getSellerList = (
  page?: number,
  params?: object
): Promise<AxiosResponse> => {
  return callAPIWithToken({
    url: `/api/sellers/`,
    method: 'get',
    params: {
      page: page,
      limit: 5,
      multiple_user_type: 'SELLER',
      ...params,
    },
  })
}
export const postAssignSeller = (
  contactId: number,
  data: AddSellerListDataType
): Promise<AxiosResponse<AddSellerListDataType>> => {
  return callAPIWithToken({
    url: `api/assign-contact/${contactId}/`,
    method: 'post',
    data: data,
  })
}

export const deleteContact = (id?: number | null): Promise<AxiosResponse> => {
  return callAPIWithToken({
    url: `/api/contact/${id}/`,
    method: 'delete',
  })
}
export const uploadFileImportApi = (formData: any): Promise<AxiosResponse> => {
  return callAPIWithToken({
    url: '/api/import-contacts/',
    method: 'post',
    data: formData,
  })
}
