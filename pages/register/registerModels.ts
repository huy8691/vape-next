export interface EmailType {
  email: string
}
export interface RegisterType {
  dob: string
  email: string
  fullName: string
  gender: string
  password: string
  phoneNumber: string
  phoneOtp: string
  receivePromotion: boolean
}

export interface RegisterResponseType {
  data: any
}
