export interface Contact {
  id: number
  business_name: string
  first_name: string
  last_name: string
  phone_number: string
  federal_tax_id: string
  address: string
  assignee: ListSellerDataType[]
}

export interface ContactResponseType {
  data: Contact[]
  error: any
  totalPages: number
  nextPage: number
  previousPage: number
  currentPage: number
  limit: number
}

export interface ResearchContactType {
  search: string
}
export interface ImportFileContactType {
  importData: File[]
}
export interface ValidateSellerListDataType {
  sellers: string
  id: number
  avatar: string
  full_name: string
}
export interface AddSellerListDataType {
  sellers: number[]
}

export interface ListSellerDataType {
  id: number
  full_name: string
  avatar?: string
}
export interface ListSellerDataResponseType {
  data: ListSellerDataType[]
  error?: unknown
  totalPages?: number
  nextPage?: number
  previousPage?: number
  currentPage?: number
  limit?: number
}
