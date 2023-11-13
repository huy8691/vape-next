export interface RoleTypeDataResponseType {
  totalPages?: number
  totalItems: number
  errors?: any
  currentPage: number
  previousPage: number | null
  nextPage: number | null
  data: RoleTypeDataType[]
}

export interface RoleTypeDataType {
  module: string
  permissions: PermissionDataType
}

export interface PermissionDataType {
  [key: string]: {
    id: number
    name: string
    created_at: string
    description: string
  }
}

export interface CreateRoleTypeDataType {
  name: string
  permissions: permissionsForCreate[]
}

export interface permissionsForCreate {
  id: number
  is_checked: boolean
}

export interface ListRoleDataResponseType {
  totalPages?: number
  totalItems: number
  errors?: any
  currentPage: number
  previousPage: number | null
  nextPage: number | null
  data: ListRoleTypeDataType[]
}

export interface ListRoleTypeDataType {
  id: number
  create_at: string
  update_at: string
  name: string
  organization: string
  parent_role: string
  path: string
}

export interface SortDataType {
  id: number
  name: string
  created_at: string
  description: string
}

export interface arrListIsCheck {
  [key: number]: number
}
