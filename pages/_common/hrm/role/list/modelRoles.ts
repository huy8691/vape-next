export interface RoleTypeData {
  id: number
  created_at: string
  updated_at: string
  name: string
  organization: string
  parent_role: string
  creator: string
}

// export interface childRoleTypeData {
//   id: number
//   name: string
//   is_displayed: boolean
//   child_category: childRoleTypeData[]
//   parent_category: parentRoleTypeData
// }

export interface RoleListResponseType {
  success?: boolean
  statusCode?: number
  message?: string
  nextPage?: number | null
  totalItems?: number
  currentPage?: number
  totalPages?: number
  limit?: number
  data: RenderTreeType[]
}
export interface RenderTreeType {
  id: number
  name: string
  child_role: RenderTreeType[]
}

export interface OrganizationInfoType {
  id: number
  name: string
}
