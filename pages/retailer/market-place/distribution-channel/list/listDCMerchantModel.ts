export interface DCMerchantDataType {
  id: number
  id_organization: number
  organization_name: string
  distribution_channel_name: string
  distribution_channel_code: number
  distribution_channel_id: number
  joined_date: string
}

export interface ListDCMerchantResponsiveType {
  success: boolean
  statuscode: number
  message: string
  totalItems: number
  nextPage: number | null
  previousPage: number | null
  currentPage: number | 1
  totalPages: number
  limit: number
  data: DCMerchantDataType[]
}
export interface ListOwnedDCType {
  success: boolean
  statuscode: number
  message: string
  totalItems: number
  nextPage: number | null
  previousPage: number | null
  currentPage: number | 1
  totalPages: number
  limit: number
  data: OwnedDCDataType[]
}

export interface OwnedDCDataType {
  id: number
  name: string
  code: string
  is_default: boolean
}
