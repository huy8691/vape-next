export interface RoleTypeDataResponseType {
  success: boolean
  statusCode: number
  totalPages?: number
  message: string
  totalItems: number
  errors?: any
  currentPage: number
  previousPage: number | null
  nextPage: number | null
  limit: number
  data: RoleTypeDataType[]
}

export interface RoleTypeDataType {
  id: number
  name: string
  organization: string
}
