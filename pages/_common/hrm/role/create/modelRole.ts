export interface ValidateAddroleType {
  name: string
  parent_role?: string | null
}
export interface roleType {
  id: number
  name: string
  parent_role: string
  organization: string
}

export interface roleListResponseType {
  statusCode?: number
  message?: string
  nextPage?: number | null
  totalItems?: number
  currentPage?: number
  totalPages?: number
  limit?: number
  data: roleType[]
}
