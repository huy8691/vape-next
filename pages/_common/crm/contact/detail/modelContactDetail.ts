export interface ContactDetailType {
  id: number
  first_name: string
  last_name: string
  business_name: string
  federal_tax_id: string
  phone_number: string
  email: string
  address: string
  lead_type: string
  type_of_lead: { id: number; name: string }
  lead_other: string
  source_type: string
  source_other: string
  contact_type: { id: number; name: string }
  lead_source: string
  expected_revenue: number
  contact_status: { id: number; name: string }
  contact_option: { id: number; name: string }
  is_merchant: boolean
  is_requested: boolean
}
export interface UpdateContactDetailType {
  id: number
  first_name: string
  last_name: string
  business_name: string
  federal_tax_id: string
  phone_number: string

  address: string
  type_of_lead: { id: number; name: string }
  lead_other: string

  expected_revenue: number
}

export interface ActivityLogType {
  avatar: string
  content: string
  files: string[]
  full_name: string
  id: number
  is_edited: boolean
  is_owned: boolean
  log_type: string
  time: string
  updated_time: string | null
}
export interface ActivityLogsDataResponseType {
  data: ActivityLogType[]
  error?: unknown
  totalPages?: number
}
export interface CreateActivityLogsType {
  content: string
  files: string[] | null
  log_type: number
}
export interface UpdateActivityLogsType {
  content: string
  files: string[] | null
}

export interface PurchaseOrderTypeData {
  id: number
  purchase_order_code: string
  status: string
  shipping_fee: string
  notes: string
  order_date: string
  sub_total: number
  total_billing: string
  total_value: string
  created_at: string
  payment_method_detail: {
    id: number
    name: string
  }
  shipping_method_detail: {
    id: number
    name: string
  }
  items: [
    {
      id: number
      code: string
      name: string
      thumbnail: string

      quantity: number
      total: number
      unit_price: number
      unit_type: string
    }
  ]
  contact_detail: {
    id: number
    phone_number: string
    email: string
    first_name: string
    last_name: string
    business_name: string
    federal_tax_id: string
    address: string
    city: string
    state: string
    postal_zipcode: string
  }
}
export interface PurchaseOrderResponseTypeData {
  success: boolean
  statusCode: number
  message: string
  totalItems: number
  currentPage: number
  totalPages: number
  limit: number
  previousPage: number | null
  nextPage: number | null
  data: PurchaseOrderTypeData[]
}
export interface ResearchPurchaseOrderType {
  code: string
}

export interface SingleChoiceDataType {
  id: number
  name: string
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

export interface LastPODataType {
  id: number
  code: string
  order_date: string
  total_billing: number
}

export interface LastPODataResponseType {
  success: boolean
  stattus: number
  message: string
  data?: LastPODataType
}

export interface UpdateInformationSingleChoiceDataType {
  contact_type?: number
  contact_status?: number
  contact_option?: number
}

export interface TotalRevenueOfContact {
  success: boolean
  stattus: number
  message: string
  data?: {
    total_revenue?: number
  }
}

export interface ConvertContactToMerchantType {
  first_name: string
  last_name: string
  email: string
  phone_number: string
  business_name: string
  federal_tax_id: string
  address: string
  sub_address: string
  postal_zipcode: number
  city: string
  state: string
  website_link_url: string | null
  monthly_purchase: number
  monthly_purchase_other?: string
  monthly_sale: number
  monthly_sale_other?: string
  type_of_sale: number
  type_of_sale_other?: string
  find_us_over: number
  find_us_over_other?: string
  total_locations: number
  id_verification: string
  payment_processing: string
  vapor_tobacco_license: string
  business_tax_document: string
}

export interface AttachmentsDataResponseType {
  success: boolean
  status: number
  message: string
  data?: string[]
}
