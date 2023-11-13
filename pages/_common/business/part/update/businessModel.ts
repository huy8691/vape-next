export interface UpdateBusinessType {
  business_name: string
  website_link_url: string
  address: string
  city: string
  state: string
  postal_zipcode: string
  federal_tax_id: string
}

export interface BusinessProfileResponseType {
  data: UpdateBusinessType
  error?: any
}

export interface StateDetailType {
  countryCode: string
  isoCode: string
  latitude: string
  longitude: string
  name: string
}
