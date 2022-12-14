export interface categoryTypeData {
  id: number
  name: string
  is_displayed: boolean
  child_category: childCategoryTypeData[]
  parent_category: parentCategoryTypeData
}

export interface childCategoryTypeData {
  id: number
  name: string
  is_displayed: boolean
  child_category: childCategoryTypeData[]
  parent_category: parentCategoryTypeData
}

export interface parentCategoryTypeData {
  id: number
  name: string
}
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
  search: string
}
