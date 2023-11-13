export interface AttributeType {
  id: number
  name: string
  options: []
}
export interface AttributePropType {
  id: number
  name: string
  options: OptionDetailType[]
}
export interface OptionDetailType {
  id: number
  name: string
}
export interface AttributeResponseType {
  data: AttributeType[]
  totalPages?: number
  errors?: unknown
  currentPage?: number
  nextPage?: number | null
  totalItems?: number
}
export interface AttributePropResponseType {
  data: AttributePropType[]
  totalPages?: number
  errors?: unknown
  currentPage?: number
  nextPage?: number | null
  totalItems?: number
}
export interface AttributeWithOptionType {
  name: string
  option: string
}
export interface WarehouseSubmitType {
  warehouse: number
  quantity: number
}
export interface BeforeSubmitCreateVariantType {
  options: AttributeWithOptionType[]
  price: any
  warehouses: WarehouseSubmitType[]
  thumbnail: string | null
  images: string[]
  distribution_channel: number[]
  error?: boolean
}
export interface CreateAttributesOptionType {
  attribute: {
    id?: number
    name: string
    options: string[] | OptionDetailType[] | []
  }
  options: string[]
}
export interface ValidateCreateAttributesOptionsType {
  arr_attributes: CreateAttributesOptionType[]
}
