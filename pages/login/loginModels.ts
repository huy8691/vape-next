export interface LoginType {
  email: string
  password: string
  platform: string
}

export interface LoginResponseType {
  data: {
    access_token: string
  }
  message: string
}
