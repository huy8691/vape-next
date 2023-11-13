export interface DynamicPermissionType {
  [key: string]: number
}
export interface PermissionType {
  module: string
  permissions: DynamicPermissionType
}

export interface PermissionResponseType {
  data: PermissionType[]
  nextPage?: number
  currentPage?: number
  totalPages?: number
  success?: boolean
  totalItems?: number
}
