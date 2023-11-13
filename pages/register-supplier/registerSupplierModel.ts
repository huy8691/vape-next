export interface EmailType {
  email: string
}
export interface RegisterValidateType {
  first_name: string
  last_name: string
  email: string
  phone_number: string
  business_name: string
  business_phone_number: string
  website_link_url: string
  federal_tax_id: string
  business_tax_document: string
  vapor_tobacco_license: string
  address: string
  sub_address: string
  city: string
  state: {
    name: string
    abbreviation: string
  }
  postal_zipcode: string
  signature: string
  brands: string

  poc_first_name: string
  poc_last_name: string
  poc_email: string
  poc_phone_number: string

  owner_email: string
  owner_phone_number: string

  name_on_account: string
  bank_name: string
  bank_address: string
  bank_phone_number: string
  routing_number: string
  account_number: string
  shipping_services: string[]
  name_shipping: string
  checkbox: boolean
}

export interface RegisterType {
  first_name: string
  last_name: string
  email: string
  phone_number: string
  business_name: string
  business_phone_number: string
  website_link_url: string | null
  federal_tax_id: string
  business_tax_document: string
  vapor_tobacco_license: string
  address: string
  sub_address: string
  city: string
  state: string
  postal_zipcode: string
  signature: string
  brands: string

  poc_first_name: string
  poc_last_name: string
  poc_email: string
  poc_phone_number: string

  owner_email: string
  owner_phone_number: string

  name_on_account: string
  bank_name: string
  bank_address: string
  bank_phone_number: string
  routing_number: string
  account_number: string
  shipping_services: string
  name_shipping: string
  checkbox: boolean
}

export interface RegisterResponseType {
  data: any
  message: string
}
