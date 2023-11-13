export interface GroupType {
  group: string
  total_amount_due: number
}
export interface SummaryDetailType {
  supplier?: string
  retailer?: string
  data: GroupType[]
  total: number
}
export interface SummarayResponseType {
  data?: SummaryDetailType[]
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
