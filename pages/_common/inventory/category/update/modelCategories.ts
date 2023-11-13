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
export interface UpdateCategoryType {
  name: string
  parent_category?: number | null
}
export interface AddCategoryType {
  name: string
  parent_category?: number
}

export interface SearchFormInput {
  search: string
}
export interface CategoryDetailResponseType {
  data?: categoryTypeData
}
