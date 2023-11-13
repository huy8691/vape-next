export interface ListMerchantDataType {
  id: number
  organization: string
  organization_id: number
  joined_date: string
}

export interface ListMerchantDataResponseType {
  success: boolean
  statuscode: number
  message: string
  totalItems: number
  nextPage: number | null
  previousPage: number | null
  currentPage: number | 1
  totalPages: number
  limit: number
  data: ListMerchantDataType[]
}

export interface DetailMerchantChannelType {
  id: number
  name: number
  code: string
}

export interface ParamsDataType {
  id: string
  limit: string | null
  page: string | null
}

export interface DetailMerchantChannelResponseType {
  success: boolean
  status: number
  message: string
  data: DetailMerchantChannelType
}
