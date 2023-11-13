export interface RoleType {
  id: number
  name: string
  organization: string
  parent_role: string
  creator: string
  child_role: RoleType[]
}

export interface listRoleResponseType {
  data: RoleType[]
  success?: boolean
  statusCode?: number
  message?: string
  totalItems?: number
  currentPage?: number
  nextPage?: number
  totalPages?: number
  limit?: number
}

export interface DynamicPermissionType {
  [key: string]: number
}
export interface PermissionType {
  module: string
  permissions: DynamicPermissionType
}

export interface DynamicPermissionOfRoleType {
  [key: string]: {
    id: number
    name: string
    created_at: string
  }
}
export interface PermissionOfRoleType {
  module: string
  permissions: DynamicPermissionOfRoleType
}

export interface AssignPermissionType {
  permissions: number[]
  deleted_permissions: any[]
}

export interface listBoundaryPermissionResponseType {
  data: PermissionOfRoleType[]
  success?: boolean
  statusCode?: number
  message?: string
  totalItems?: number
  currentPage?: number
  nextPage?: number
  totalPages?: number
  limit?: number
}
export interface listPermissionOfRoleResponseType {
  data: PermissionType[]
  success?: boolean
  statusCode?: number
  message?: string
  totalItems?: number
  currentPage?: number
  totalPages?: number
  limit?: number
  nextPage?: number
}

export interface SearchType {
  search: string
}

export interface NewRoleTypeTyle {
  id: number
  name: string
  array: PermissionType[]
}

export interface ListRoleTypesType {
  id: number
  name: string
  organization: string
}

export interface ListRoleTypesResponseType {
  data: ListRoleTypesType[]
  success?: boolean
  statusCode?: number
  message?: string
  totalItems?: number
  currentPage?: number
  totalPages?: number
  limit?: number
  nextPage?: number
}

export interface DynamicPermissionForRoleTypeDetailType {
  [key: string]: {
    id: number
    created_at: string
    is_checked: number
  }
}
export interface PermissionForRoleTypeDetailType {
  permissions: DynamicPermissionForRoleTypeDetailType
}
export interface RoleTypeDetailType {
  id: number
  name: string
  permissions: PermissionForRoleTypeDetailType[]
}

export interface RoleTypeDetailResponseType {
  data: RoleTypeDetailType
  success?: boolean
  message?: string
}

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
