// export interface putResponseType {
//   data: FormItem
//   message: string
//   id: number
// }
export interface manuTypeData {
  id?: number
  name: string
  logo: string | null
}

export interface manuResponseTypeData {
  success: boolean
  statusCode: number
  message: string
  totalItems: number
  currentPage: number
  totalPages: number
  limit: number
  data: manuTypeData
}
