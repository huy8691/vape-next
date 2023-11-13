export interface LoginType {
  email: string
  password: string
  platform: string
}

export interface LoginResponseType {
  data: {
    access_token: string
    refresh_token: string
    info: {
      user_type: string
    }
  }
  message: string
}

export interface DynamicPermissionType {
  [key: string]: number
}
export interface PermissionType {
  module: string
  permissions: DynamicPermissionType
}
export interface PermissionResponseType {
  data: PermissionType[]
}
