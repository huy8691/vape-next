export interface EmailType {
  email: string
}
export interface RegisterValidateType {
  first_name: string
  last_name: string
  phone_number: string
  email: string
  business_name: string
  website_link_url: string | null
  monthly_purchase: string
  monthly_purchase_other?: string
  monthly_sale: string
  monthly_sale_other?: string
  find_us_over: string
  find_us_over_other?: string
  type_of_sale: string
  type_of_sale_other: string
  id_verification: string
  total_locations: string
  payment_processing: string
  federal_tax_id: string
  business_tax_document: string
  vapor_tobacco_license: string
  address: string
  city: string
  state: {
    name: string
    abbreviation: string
  }
  sub_address: string
  postal_zipcode: string
  organization_refferal?: string
  signature: string
  checkbox: boolean
}
export interface RegisterType {
  first_name: string
  last_name: string
  phone_number: string
  email: string
  business_name: string
  website_link_url: string | null
  monthly_purchase: string
  monthly_purchase_other?: string
  monthly_sale: string
  monthly_sale_other?: string
  find_us_over: string
  find_us_over_other?: string
  type_of_sale: string
  type_of_sale_other: string
  id_verification: string
  total_locations: string
  payment_processing: string
  federal_tax_id: string
  business_tax_document: string
  vapor_tobacco_license: string
  address: string
  city: string
  state: string
  postal_zipcode: string
  organization_refferal?: string
  sub_address: string
  signature: string
  checkbox: boolean
}

export interface RegisterResponseType {
  data: RegisterType
  message: string
}
