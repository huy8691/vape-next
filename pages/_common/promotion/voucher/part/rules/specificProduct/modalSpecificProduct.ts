export interface ProductSpecificDataType {
  success?: boolean
  statusCode?: number
  message?: string
  totalItems?: number
  nextPage?: number
  previousPage?: null
  currentPage?: number
  totalPages?: number
  limit?: number
  data?: Datum[]
}

export interface Datum {
  id?: number
  name?: string
  brand?: Brand
  manufacturer?: Brand
  description?: null | string
  longDescription?: null | string
  thumbnail?: string
  images?: string[]
  code?: string
  category?: Category
  category_marketplace?: Category
  unit_type?: UnitType
  updated_at?: Date
  is_active?: boolean
  variants_count?: number
}

export interface Brand {
  id?: number
  name?: string
  logo?: null | string
}

export interface Category {
  id?: number
  name?: string
  parent_category?: ParentCategory
  is_displayed?: boolean
  organization_info?: OrganizationInfo
}

export interface OrganizationInfo {
  id?: number
  name?: Name
}

export type Name = 'Exnodes Merchant'

export interface ParentCategory {
  id?: number
  name?: string
  is_displayed?: boolean
  organization_info?: OrganizationInfo
}

export type UnitType = 'UNIT' | 'PACKAGE'

export interface ProductSpecific {
  id?: number
  product_id?: number
  name?: string
  description?: null
  thumbnail?: null
  images?: any[]
  code?: string
  quantity?: number
  is_active?: boolean
  wholesale_price?: number
  retail_price?: number
  low_stock_level?: number
  unit_type?: string
  attribute_options?: AttributeOption[]
}

export interface AttributeOption {
  attribute?: string
  option?: string
}
