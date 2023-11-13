export interface MessageDetailType {
  id: number
  title: string
  created_at: string
  latest_send: any
  message: string
}
export interface CreateMessageType {
  title: string
  message: string
}
export interface ListMessageResponseType {
  data: MessageDetailType[]
  errors?: any
  totalPages?: number
}
export interface CreateMessageResponseType {
  data: { id: number }
}
export interface SendNMessageType {
  enable_retailer: boolean
  all_retailer?: boolean
  retailer?: number[]
  enable_leads: boolean
  all_leads?: boolean
  leads?: number[]
  enable_customers: boolean
  all_customer?: boolean
  customers?: number[]
  over_email: boolean
  over_noti: boolean
}

export interface RetailerDataType {
  business_id: number
  business_name: string
  federal_tax_id: string
  owner_name: string
  phone_number: string
  email: string
}

export interface RetailerDataResponseType {
  data: RetailerDataType[]
  totalPages?: number
  errors?: any
  totalItems: number
  currentPage: number
  previousPage: number | null
  nextPage: number | null
}
export interface TypeOfLeadDetailType {
  id: number
  name: string | null
}
export interface ContactDetailType {
  id: number
  business_name: string
  first_name: string
  last_name: string
  phone_number: string
  federal_tax_id: string
  address: string
  email: string
  type_of_lead?: TypeOfLeadDetailType | null
}

export interface ListContactResponseType {
  data: ContactDetailType[]
  error: any
  totalPages?: number
  nextPage?: number
  totalItems: number

  previousPage?: number
  currentPage?: number
  limit?: number
}
export interface ListClientResponseType {
  data: ClientDetailType[]
  errors?: any
  totalItems: number
  nextPage: number
  previousPage: number
  limit: number
  totalPages: number
}
export interface ClientDetailType {
  id: number
  email: string
  phone_number: string
  business_name: string
  first_name: string
  last_name: string
  full_name: string
  address: string
  is_vip: boolean
}
