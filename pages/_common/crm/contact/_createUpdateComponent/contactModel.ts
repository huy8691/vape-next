export interface ContactType {
  business_name: string
  first_name: string
  last_name: string
  phone_number: string
  federal_tax_id: string
  address: string
  email?: string | null
  type_of_lead?: number
  lead_other?: string
  source?: number
  source_other?: string
  contact_status: number
  contact_type: number
  contact_option: number
  expected_revenue: number
}

export interface ContactUpdateType {
  business_name: string
  first_name: string
  last_name: string
  phone_number: string
  federal_tax_id: string
  address: string
}
