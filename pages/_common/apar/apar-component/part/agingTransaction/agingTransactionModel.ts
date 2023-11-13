export interface TransactionDetailType {
  date: string
  retailer: string
  amount: number
  receipt_number: number
  invoice_number: number
  is_external: boolean
  order_id: number
}

export interface TransactionDetailResponseType {
  data: TransactionDetailType[]
  errors?: any
}
export interface FilterDataType {
  fromDate: Date
  toDate: Date
}

export interface ExportType {
  url: string
}

export interface ExportResponseType {
  data: ExportType
  errors: any
}
