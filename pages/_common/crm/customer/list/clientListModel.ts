export interface ClientDetailType {
  id: number
  email: string
  phone_number: string
  business_name: string
  first_name: string
  last_name: string
  address: string
  is_vip: boolean
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

export interface SubmitClientType {
  first_name: string
  last_name: string | null
  address: string | null
  phone_number: string
  email: string | null
  business_name: string | null
}
