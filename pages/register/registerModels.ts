export interface EmailType {
  email: string
}
export interface RegisterType {
  first_name: string
  last_name: string
  phone_number: number
  email: string
  business_name: string
  website_link_url: string
  monthly_purchase: number
  monthly_purchase_other?: string
  monthly_sale: number
  monthly_sale_other?: string
  find_us_over: number
  find_us_over_other?: string
  type_of_sale: number
  type_of_sale_other: string
  id_verification: string
  total_locations: number
  payment_processing: string
  federal_tax_id: string
  business_tax_document: string
  vapor_tobacco_license: string
  address: string
  city: string
  state: string
  postal_zipcode: string
  signature: string
}

export interface RegisterResponseType {
  data: any
}
