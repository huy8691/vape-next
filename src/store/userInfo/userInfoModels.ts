export interface UserInfoType {
  avatar?: string | null
  email?: string
  fullName?: string
  id?: number
  phoneNumber?: string
  dob?: string
  gender?: string
}
export interface UserInfoResponseType {
  data: UserInfoType
  isSuccess: boolean
}
