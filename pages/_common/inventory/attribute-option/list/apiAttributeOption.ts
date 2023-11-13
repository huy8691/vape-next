import { AxiosResponse } from 'axios'
import { callAPIWithToken } from 'src/services/jwt-axios'
import {
  EditNameType,
  ListAttributeResponseType,
  SubmitOptionType,
  SubmitUpdateAttributeOptionType,
} from './modelAttributeOption'

const getAttribute = (
  params: object
): Promise<AxiosResponse<ListAttributeResponseType>> => {
  return callAPIWithToken({
    url: `/api/attributes/`,
    method: 'get',
    params: {
      ...params,
    },
  })
}
const updateAttribute = (
  index: number,
  data: EditNameType
): Promise<AxiosResponse<ListAttributeResponseType>> => {
  return callAPIWithToken({
    url: `/api/attributes/${index}/`,
    method: 'put',
    data: data,
  })
}
const updateOption = (
  index: number,
  data: SubmitOptionType
): Promise<AxiosResponse<ListAttributeResponseType>> => {
  return callAPIWithToken({
    url: `/api/options/${index}/`,
    method: 'put',
    data: data,
  })
}
const createOption = (
  data: SubmitOptionType
): Promise<AxiosResponse<ListAttributeResponseType>> => {
  return callAPIWithToken({
    url: `/api/options/`,
    method: 'post',
    data: data,
  })
}
const deleteAttribute = (index: number): Promise<AxiosResponse> => {
  return callAPIWithToken({
    url: `/api/attributes/${index}/`,
    method: 'delete',
  })
}
const updateAttributeOption = (
  index: number,
  data: SubmitUpdateAttributeOptionType
): Promise<AxiosResponse> => {
  return callAPIWithToken({
    url: `/api/attributes/${index}/`,
    method: 'put',
    data: data,
  })
}
const deleteOption = (index: number): Promise<AxiosResponse> => {
  return callAPIWithToken({
    url: `/api/options/${index}/`,
    method: 'delete',
  })
}

export {
  updateAttributeOption,
  getAttribute,
  updateAttribute,
  updateOption,
  createOption,
  deleteAttribute,
  deleteOption,
}
