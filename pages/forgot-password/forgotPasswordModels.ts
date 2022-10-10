export interface LoginType {
  email: string
  password: string
  user_type: string
}

export interface UserInfoType {
  avatar?: string | null
  email?: string
  fullName?: string
  id?: number
  phoneNumber?: string
  status?: number
}
export interface LoginResponseType {
  data: {
    access_token: string
    userInfo: UserInfoType
  }
}
