export interface purchaseOrderTypeData {
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
export interface purchaseOrderResponseTypeData {
  success: boolean
  statusCode: number
  message: string
  totalItems: number
  currentPage: number
  totalPages: number
  limit: number
  previousPage: number | null
  nextPage: number | null
  data: purchaseOrderTypeData[]
}
export interface formSearch {
  purchase_order_code?: string | string[]
}
