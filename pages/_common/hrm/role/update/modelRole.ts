export interface ValidateAddroleType {
  name: string
  parent_role: number | null
}
export interface submitAddroleType {
  name: string
  parent_role: number | null
}
export interface roleType {
  id: number
  name: string
  parent_role: number
  organization: string
}

export interface roleResponseType {
  statusCode?: number
  message?: string
  nextPage?: number | null
  totalItems?: number
  currentPage?: number
  totalPages?: number
  limit?: number
  data: roleType
}
