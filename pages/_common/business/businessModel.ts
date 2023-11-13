export interface BusinessAvatarType {
  logo: string
}

export interface BusinessProfileType {
  logo: string
  business_name: string
  website_link_url: string
  address: string
  city: string
  state: string
  postal_zipcode: string
  custom_tax_rate: string
  federal_tax_id: string
  business_tax_document: string
  vapor_tobacco_license: string
}

export interface BusinessResponseType {
  data: BusinessProfileType
  error?: any
}
