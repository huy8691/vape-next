export interface SupplierRequestType {
  id: number
  created_at: string
  updated_at: string
  is_deleted: boolean
  first_name: string
  last_name: string
  phone_number: string
  email: string
  business_name: string
  business_phone_number: string
  website_link_url: string
  business_tax_document: string
  vapor_tobacco_license: string
  address: string
  sub_address: string
  brands: string
  city: string
  owner_email: string
  state: string
  postal_zipcode: string
  signature: string
  federal_tax_id: string
  poc_first_name: string
  poc_last_name: string
  poc_email: string
  poc_phone_number: string
  name_on_account: string
  bank_name: string
  bank_address: string
  bank_phone_number: string
  routing_number: string
  account_number: string
  shipping_services: string
  status: string
}
export interface SupplierRequestDataResponseType {
  data: SupplierRequestType[]
  error?: unknown
  totalPages?: number
}

export interface SupplierDetailType {
  id: number
  created_at: string
  updated_at: string
  is_deleted: boolean
  first_name: string
  last_name: string
  phone_number: string
  email: string
  business_name: string
  business_phone_number: string
  website_link_url: string
  business_tax_document: string
  vapor_tobacco_license: string
  address: string
  sub_address: string
  brands: string
  city: string
  state: string
  owner_email: string
  postal_zipcode: string
  signature: string
  federal_tax_id: string
  poc_first_name: string
  poc_last_name: string
  poc_email: string
  poc_phone_number: string
  name_on_account: string
  bank_name: string
  bank_address: string
  bank_phone_number: string
  routing_number: string
  account_number: string
  shipping_services: string
  status: string
}
