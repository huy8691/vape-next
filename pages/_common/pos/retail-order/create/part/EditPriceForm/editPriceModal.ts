export interface OtherProductType {
  product_name: string
  quantity: number
  price: number
  unit_type: string
}

export interface EditPriceType {
  edited_price: number
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
}
export interface AttributeOptionInProductDetailType {
  attribute: string
  option: string
}
