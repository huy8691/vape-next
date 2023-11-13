export interface SellerDataType {
  id: number
  email: string
  full_name: string
  status: string
  user_type: string
  created_at: string
  commission: number
  roles: RoleDetailFromListRoleType[]
}
export interface RoleDetailFromListRoleType {
  id: number
  name: string
  parent_role_id: number
  organization_id: number
  creator_id: number
}
export interface SellerDataResponseType {
  data: SellerDataType[]
  error?: unknown
  totalPages?: number
}
export interface researchSellerType {
  search: string
}
export interface CommissionType {
  commission: number | null
}
export interface CommisionResponseType {
  data: CommissionType
  error?: any
}
// export interface RoleTypeData {
//   id: number
//   created_at: string
//   updated_at: string
//   name: string
//   organization: string
//   parent_role: string
//   creator: string
// }

// export interface RoleListResponseType {
//   success?: boolean
//   statusCode?: number
//   message?: string
//   nextPage?: number | null
//   totalItems?: number
//   currentPage?: number
//   totalPages?: number
//   limit?: number
//   data: RoleTypeData[]
// }
export interface OrganizationInfoType {
  id: number
  name: string
}
export interface RenderTreeType {
  organization: OrganizationInfoType
  id: number
  name: string
  child_role: RenderTreeType[]
  parent_role: number | null
}
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

export interface AssignRoleForUserType {
  user: number
  roles: number[]
}
export interface ListUserWithRoleType {
  id: number
  full_name: string
  email: string

  roles: RoleDetailFromListRoleType[]
  commission: number
}
export interface RoleDetailFromListRoleType {
  id: number
  name: string
  parent_role_id: number
  organization_id: number
  creator_id: number
}
