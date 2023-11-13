export interface DCDataType {
  name: string
}

export interface CreateChannelDataResponseType {
  code: number
  success: boolean
  status: number
  message: string
  data: DCDataType
}

export interface DetailMerchantChannelResponseType {
  success: boolean
  status: number
  message: string
  data: DetailMerchantChannelType
}

export interface DetailMerchantChannelType {
  id: number
  name: number
  code: string
}
