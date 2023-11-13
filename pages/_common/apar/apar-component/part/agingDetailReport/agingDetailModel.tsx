export interface InvoiceDetailType {
  invoice_number: string
  invoice_date: string
  due_date: string
  past_due: number
  amount: number
  amount_due: number
  order_code: string
  retailer: string
  order_id: number
  is_external: boolean
}
export interface AgingDetailType {
  group: string
  from_date: string
  to_date: string
  data: InvoiceDetailType[]
  total_amount_due: number
  amount: number
}
export interface AgingDetailResponseType {
  data?: AgingDetailType[]
  errors?: any
}
export interface FilterDataType {
  date_as_of: Date
  days_per_aging: number
  number_of_periods: number
  retailer: number[]
}

export interface ExportDetail {
  url: string
}
export interface ExportResponseType {
  data: ExportDetail
  errors?: any
}

export interface ListSupplierRetailerType {
  id: number
  name: string
}
export interface ListSupplierRetailerResponseType {
  data: ListSupplierRetailerType[]
  errors?: any
}
