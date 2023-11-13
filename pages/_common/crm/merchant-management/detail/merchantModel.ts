export interface MerchantDataType {
  business_id: number
  business_name: string
  first_name: string
  last_name: string
  federal_tax_id: string
  owner_name: string
  phone_number: string
  address: string
  email: string
  assignee: string[]
}

export interface MerchantDataResponseType {
  data?: MerchantDataType
  errors?: any
}

export interface AttachmentsDataResponseType {
  success: boolean
  status: number
  message: string
  data?: string[]
}
