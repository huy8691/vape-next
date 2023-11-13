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
  logo: string
}
export interface Search {
  name?: string | string[]
}
export interface SampleBrandType {
  id: number
  name: string
}
export interface SampleBrandResponseType {
  data: SampleBrandType[]
  nextPage?: number | null
  previousPage?: number | null
  currentPage?: number
  totalPages?: number
  errors?: any
}

export interface GetSampleForORgType {
  ids: number[]
}
