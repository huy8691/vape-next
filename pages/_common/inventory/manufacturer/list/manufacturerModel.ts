export interface ManufacturerTypeData {
  id: number
  name: string
  logo: string
  file?: string[]
}
export interface ManufacturerListResponseType {
  data: ManufacturerTypeData[]
  totalPages?: number
  totalItems: number
  errors?: any
  currentPage: number
  previousPage: number | null
  nextPage: number | null
}

export interface FormSearch {
  name?: string | string[]
}

export interface SampleManuType {
  id: number
  name: string
}

export interface SampleManuResponseType {
  data: SampleManuType[]
  nextPage?: number | null
  previousPage?: number | null
  currentPage?: number
  totalPages?: number
  errors?: any
}
export interface GetSampleForORgType {
  ids: number[]
}
