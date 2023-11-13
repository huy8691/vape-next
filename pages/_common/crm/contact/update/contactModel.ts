export interface ContactUpdateType {
  first_name: string
  last_name: string
  phone_number: string
  id?: number
  federal_tax_id: string
  address: string
  expected_revenue: number
  type_of_lead: number
  data: any
}
export interface SingleChoiceDataResponseType {
  success: boolean
  statusCode: number
  message: string
  totalItems: number
  currentPage: number
  totalPages: number
  limit: number
  previousPage: number | null
  nextPage: number | null
  data: SingleChoiceDataType[]
}
export interface SingleChoiceDataType {
  id: number
  name: string
}
