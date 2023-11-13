export interface WorkLogHistoryDataType {
  id: number
  check_in_at: Date
  check_out_at: Date
  duration: number
  status: string
  user: number
  organization: number
  full_name: string
}

export interface WorkLogHistoryResponseType {
  success: boolean
  statusCode: number
  message: string
  totalItems: number
  nextPage: null
  previousPage: null
  currentPage: number
  totalPages: number
  limit: number
  data: WorkLogHistoryDataType[]
}
