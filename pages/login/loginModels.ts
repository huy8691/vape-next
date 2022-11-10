export interface LoginType {
  email: string
  password: string
}

export interface LoginResponseType {
  data: {
    access_token: string
  }
  message: string
}
