export interface categoryTypeData {
  id: number
  name: string
  is_displayed: boolean
  child_category: categoryTypeData[]
  parent_category: {
    id: number
    name: string
    is_displayed: boolean
  }
}

// export interface childCategoryTypeData {
//   id: number
//   name: string
//   is_displayed: boolean
//   child_category: childCategoryTypeData[]
//   parent_category: parentCategoryTypeData
// }

export interface categoryListResponseType {
  success: boolean
  statusCode: number
  message: string
  nextPage: number | null
  totalItems: number
  currentPage: number
  totalPages: number
  limit: number
  data: categoryTypeData[]
}

export interface AddCategoryType {
  name: string
  parent_category?: number
}

export interface SearchFormInput {
  name?: string | string[]
}
export interface CategoryDetailResponseType {
  data?: categoryTypeData
}

export interface FileType {
  name: string
}

export interface FileListType {
  // files: any
  files: FileType[]
}
export interface SampleCategoryType {
  id: number
  name: string
}
export interface SampleCategoryResponseType {
  data: SampleCategoryType[]
  nextPage?: number | null
  previousPage?: number | null
  currentPage?: number
  totalPages?: number
  errors?: any
}

export interface GetSampleForORgType {
  ids: number[]
}
