export interface brandTypeData {
  id: number
  name: string
  logo: string
}

export interface brandResponseTypeData {
  success: boolean
  statusCode: number
  message: string
  totalItems: number
  currentPage: number
  totalPages: number
  limit: number
  data: brandTypeData[]
}
export interface AddBrandType {
  name: string
  logo: string | null
}

export interface BrandDetailResponseType {
  success: boolean
  statusCode: number
  message: string
  totalItems: number
  currentPage: number
  totalPages: number
  limit: number
  data?: brandTypeData
}
