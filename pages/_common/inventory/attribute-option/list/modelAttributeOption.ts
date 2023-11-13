export interface OptionDetailType {
  id: number
  name: string
}
export interface AttributeDetailType {
  id: number
  name: string
  organization: string
  options: OptionDetailType[]
}

export interface ListAttributeResponseType {
  data: AttributeDetailType[]
  totalPages?: number
  errors?: unknown
  currentPage?: number
  nextPage?: number | null
  totalItems?: number
  success?: boolean
}

export interface EditNameType {
  name: string
}

export interface SubmitOptionType {
  name: string
  attribute: number
}

export interface UpdateOptionDetailType {
  id: number | null
  name: string
}
export interface SubmitUpdateAttributeOptionType {
  name: string

  options: UpdateOptionDetailType[]
}
