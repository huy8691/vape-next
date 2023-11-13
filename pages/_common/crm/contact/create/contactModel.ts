export interface Contact {
  business_name: string
  first_name: string
  last_name: string
  phone_number: string
  federal_tax_id: string
  address: string
  email: string | null
  type_of_lead?: string | null
  lead_other: string
  source?: string
  source_other: string
}
