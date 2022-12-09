export interface UserInfoType {
  phone_number: string
  email: string
  first_name: string
  last_name: string
  gender: string
  dob: string
  avatar: string
  address: string
  user_type: string
}
export interface UserInfoResponseType {
  data: UserInfoType
}
