export interface SubmitDiscountForChannelType {
  type?: string
  discount_amount: number | string
  max_discount_amount?: number | null | string
  distribution_channels?: number
}
export interface SpecificProductInChannelType {
  name: string
}
export interface ListDiscountSpecificProductForChannelType {
  id: number
  type: string
  discount_amount: number
  max_discount_amount: number | null | string
  product: SpecificProductInChannelType
}
export interface ListDiscountSpecificProductForChannelType {
  data: ListDiscountSpecificProductForChannelType[]
  errors?: any
}

export interface SubmitDiscountForSpecificProductType {
  type?: string
  discount_amount: number | string
  max_discount_amount?: number | null | string
  products?: number[]
}
export interface SubmitUpdateDiscountForSpecificProductType {
  id?: number
  type?: string
  discount_amount: number | string
  max_discount_amount?: number | null | string
}
export interface BrandManuDetailType {
  id: number
  name: string
}
export interface CategoryDetailType {
  id: number
  name: string
}
export interface ListProductForApplyDCType {
  id: number
  name: string
  brand: BrandManuDetailType
  manufacturer: BrandManuDetailType
  code: string
  thumbnail: string
  unit_type: string
  variants_count: number
  retail_price: number
  category: CategoryDetailType
  instock: number
}

export interface ListProductForAppplyDCResponseType {
  data: ListProductForApplyDCType[]
  errors?: any
  totalPages?: number
  nextPage?: number | null
  previousPage?: number | null
  limit?: number
  totalItems?: number
}
export interface AttributeOptionInProductDetailType {
  attribute: string
  option: string
}
export interface VariantDataDetailType {
  id: number
  code: string
  description: string | null
  images: string[]
  quantity: number
  thumbnail: string | null
  name: string
  retail_price: number | null
  is_active: boolean
  attribute_options: AttributeOptionInProductDetailType[]
  low_stock_level: number
  unit_type: string
}
export interface VariantDetailType {
  id: number
  name: string

  images: Array<string>
  thumbnail: string
  code: string
  description?: string
  longDescription?: string

  unit_type?: string
  stockAll: number
  available_stock: number
  quantity_order: number

  low_stock_alert_level: number
  quantity: number
  is_active: boolean

  wholesale_price: number
  is_owner: boolean

  attribute_options: AttributeOptionInProductDetailType[]
}
export interface VariantDetailResponseType {
  data: VariantDetailType[]
  errors?: any
}
export interface OptionDetailType {
  id: number
  name: string
}
export interface AttributeDetailType {
  id: number
  name: string
  options: OptionDetailType[]
}

export interface SearchType {
  key: string
}
export interface CurrentProductType {
  id: number
  name: string
  variants_count?: number
  thumbnail: string | null
  code: string
}

export interface ListDiscountOfDCType {
  id: number
  type: string
  discount_amount: number
  max_discount_amount: number
}
export interface ListDiscountOfDCResponseType {
  data: ListDiscountOfDCType[]
  errors: any
}
export interface DiscountOfDCResponseType {
  data: ListDiscountOfDCType
  errors: any
}
