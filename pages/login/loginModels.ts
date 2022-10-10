export interface LoginType {
  email: string
  password: string
  user_type: string
}

export interface LoginResponseType {
  data: {
    access_token: string
  }
  message: string
}
