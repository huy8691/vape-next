export interface SubmitDiscountForChannelType {
  type?: string
  discount_amount: number | string
  max_discount_amount?: number | null | string

  is_general: boolean
  client: number
}
export interface SpecificProductInChannelType {
  name: string
}
export interface ListDiscountSpecificProductForChannelType {
  id: number
  type: string
  discount_amount: number
  max_discount_amount: number | null | string
  product_variant: SpecificProductInChannelType
}
export interface ListDiscountSpecificProductForChannelType {
  data: ListDiscountSpecificProductForChannelType[]
  errors?: any
}

export interface SubmitDiscountForSpecificProductType {
  type?: string
  discount_amount: number | string
  max_discount_amount?: number | null | string
  product_variant?: number[]
  client: number
  is_general: boolean
}
export interface SubmitUpdateDiscountForSpecificProductType {
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
export interface ProductDataType {
  id: number
  name: string
  thumbnail: string
  code: string
  category?: {
    id: number
    name: string
    is_displayed: boolean
  }
  product_id?: number
  retail_price?: number
  min_retail_price?: number
  max_retail_price?: number
  edited_price?: number
  instock?: number
  variants_count?: number
  tempQuantity?: number
  isSelected?: boolean
  is_active: boolean
  isInvalid?: boolean
  // field for product variant detail
  quantity?: number
  attribute_options?: AttributeOptionInProductDetailType[]
  isAllowed?: boolean
}

export interface ProductVariantDetailType {
  id: number
  name: string
  brand: {
    name: string
    logo: string
  }
  manufacturer: {
    name: string
    logo: string
  }
  images: Array<string>
  thumbnail: string
  code: string
  description?: string
  longDescription?: string
  unit_type?: string
  instock: number
  available_stock: number
  quantity_order: number
  category: {
    id: number
    name: string
    parent_category: {
      id?: number
      name?: string
    }
  }
  low_stock_alert_level: number

  is_active: boolean

  is_owner: boolean
  variants: ProductDataType[]
  variants_count: number
  attributes: AttributeDetailType[]
}
export interface VariantDetailResponseType {
  data: ProductVariantDetailType
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
