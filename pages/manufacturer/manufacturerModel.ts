export interface IListManufacturer {
  data?: ArrayItem[]
  totalPages?: number
  totalItems: number
  errors?: any
  currentPage: number
  previousPage: number | null
  nextPage: number | null
}

export interface ArrayItem {
  id: number
  name: string
  logo: FileList
}

export interface postResponseType {
  data: []
  message: string
}
