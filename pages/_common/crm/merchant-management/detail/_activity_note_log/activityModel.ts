export interface ActivityDataType {
  id: number
  avatar: string
  full_name: string
  time: string
  updated_time: string
  content: string
  files: string[]
  is_edited: boolean
  log_type: string
  is_creator: boolean
}

export interface ListActivityDataResponseType {
  data: ActivityDataType[]
  totalPages?: number
  errors?: any
  totalItems: number
  currentPage: number
  previousPage: number | null
  nextPage: number | null
}

export interface CreateActivityLogsType {
  content: string
  files: string[] | null
  log_type: string
}
export interface UpdateActivityLogsType {
  content: string
  files: string[] | null
}
