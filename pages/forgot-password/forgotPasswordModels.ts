export interface EmailType {
  email: string
}

export interface TokenCodeType {
  email: string
  token: string
}
export interface NewPasswordType {
  email: string
  token: string
  new_password: string
}
