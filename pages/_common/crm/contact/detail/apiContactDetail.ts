import { AxiosResponse } from 'axios'
import { callAPIWithToken } from 'src/services/jwt-axios'
import {
  AttachmentsDataResponseType,
  ConvertContactToMerchantType,
  CreateActivityLogsType,
  LastPODataResponseType,
  PurchaseOrderResponseTypeData,
  SingleChoiceDataResponseType,
  TotalRevenueOfContact,
  UpdateActivityLogsType,
  UpdateInformationSingleChoiceDataType,
} from './modelContactDetail'

export const getContactDetail = (id: number): Promise<AxiosResponse> => {
  return callAPIWithToken({
    url: `/api/contact/${id}/`,
    method: 'get',
  })
}
export const deleteActivityLogs = (id: number): Promise<AxiosResponse> => {
  return callAPIWithToken({
    url: `/api/activity-log/${id}/`,
    method: 'delete',
  })
}
export const createActivityLogs = (
  id: number,
  data: CreateActivityLogsType
): Promise<AxiosResponse<CreateActivityLogsType>> => {
  return callAPIWithToken({
    url: `api/contact/${id}/activity-log/`,
    method: 'post',
    data: data,
  })
}
export const updateActivityLogs = (
  id: number,
  data: UpdateActivityLogsType
): Promise<AxiosResponse<UpdateActivityLogsType>> => {
  return callAPIWithToken({
    url: `/api/activity-log/${id}/`,
    method: 'put',
    data: data,
  })
}

export const getDetailActivityLogs = (id: number): Promise<AxiosResponse> => {
  return callAPIWithToken({
    url: `/api/activity-log/${id}/`,
    method: 'get',
  })
}
export const getListActivityLogs = (
  id: number,
  params?: object
): Promise<AxiosResponse> => {
  console.log('haha')
  return callAPIWithToken({
    url: `api/contact/${id}/activity-log/`,
    method: 'get',
    params: {
      limit: 10,
      ...params,
    },
  })
}

export const getListPurchaseOrder = (
  params?: any
): Promise<AxiosResponse<PurchaseOrderResponseTypeData>> => {
  return callAPIWithToken({
    url: `/api/contact/${params.id}/purchase-order/`,
    method: 'get',
    params: {
      ...params,
    },
  })
}

export const getListContactType = (): Promise<
  AxiosResponse<SingleChoiceDataResponseType>
> => {
  return callAPIWithToken({
    url: `/api/contact-type/`,
    method: 'get',
  })
}

export const getListContactStatus = (): Promise<
  AxiosResponse<SingleChoiceDataResponseType>
> => {
  return callAPIWithToken({
    url: `/api/contact-status/`,
    method: 'get',
  })
}

export const getListContactOption = (): Promise<
  AxiosResponse<SingleChoiceDataResponseType>
> => {
  return callAPIWithToken({
    url: `/api/contact-option/`,
    method: 'get',
  })
}

export const getListLeadSource = (): Promise<
  AxiosResponse<SingleChoiceDataResponseType>
> => {
  return callAPIWithToken({
    url: `/api/type-of-lead/`,
    method: 'get',
  })
}

export const getLastPurchaseOrderOfContact = (
  id: number
): Promise<AxiosResponse<LastPODataResponseType>> => {
  return callAPIWithToken({
    url: `/api/last-purchase-order-of-contact/${id}/`,
    method: 'get',
  })
}

export const UpdateInformation = (
  id: number,
  data: UpdateInformationSingleChoiceDataType
): Promise<AxiosResponse<LastPODataResponseType>> => {
  console.log('update', data)
  return callAPIWithToken({
    url: `/api/contact/${id}/`,
    method: 'put',
    data: data,
  })
}

export const getTotalRevenueOfContact = (
  id: number
): Promise<AxiosResponse<TotalRevenueOfContact>> => {
  return callAPIWithToken({
    url: `/api/total-revenue-of-contact/${id}/`,
    method: 'get',
  })
}

export const createMerchantFromAContact = (
  id: number,
  data: ConvertContactToMerchantType
): Promise<AxiosResponse<ConvertContactToMerchantType>> => {
  return callAPIWithToken({
    url: `/api/contact/${id}/create-merchant/`,
    method: 'post',
    data: data,
  })
}

export const getListAttachmentApi = (
  id?: number
): Promise<AxiosResponse<AttachmentsDataResponseType>> => {
  return callAPIWithToken({
    url: `/api/contact/${id}/attachments/`,
  })
}
