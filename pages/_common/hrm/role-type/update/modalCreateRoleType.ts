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

export interface UpdateRoleTypeDataType {
  name: string
  permissions: permissionsForCreate[]
}

export interface permissionsForCreate {
  id: number
  is_checked: boolean
}

// ------------------

export interface RoleTypeListDataResponseType {
  success: boolean
  status: number
  totalPages?: number
  message: string
  totalItems: number
  errors?: any
  currentPage: number
  previousPage: number | null
  nextPage: number | null
  limit: number
  data: RoleTypeListDataType
}

export interface RoleTypeListDataType {
  id: number
  name: string
  permissions: PermissionListDataType[]
}

export interface PermissionListDataType {
  module: string
  permissions: PermissionModule
}

export interface PermissionModule {
  [key: string]: {
    id: number
    created_at: string
    is_checked: number
  }
}
