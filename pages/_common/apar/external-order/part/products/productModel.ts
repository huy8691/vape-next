export interface ProductData {
  id: number
  name: string
  // description: string
  // longDescription: string

  thumbnail: string | null
  code: string
  updated_at?: string
  brand?: {
    id: number
    name: string
    logo: string
  }
  category?: {
    id: number
    name: string
    is_displayed: boolean
  }
  manufacturer?: {
    id: number
    name: string
    logo: string
  }
  // brand: string
  // category: string
  // manufacturer: string
  instock?: number
  stockAll?: number
  unit_type: string
  is_active: boolean
  images: Array<string>
  retail_price: number | null
  warning_low_stock_alert?: boolean
  low_stock_alert_level?: number
  variants_count?: number
  warehouses: { id: number; name: string }[]
}
export interface ListProductDataType {
  data?: ProductData[]
  totalPages?: number
  errors?: any
  totalItems: number
  currentPage: number
  previousPage: number | null
  nextPage: number | null
}

export interface WarehouseType {
  id: number
  name: string
  quantity: number
}

export interface DistributionChannelType {
  id: number
  name: string
  code: string
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
  warehouses: { id: number; name: string }[]
  product_id: number
  have_variant: boolean
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

export interface VariantDetailType {
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
  stockAll: number
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
  warehouses: WarehouseType[]
  is_active: boolean
  distribution_channels_sales: DistributionChannelType[]
  distribution_channels_bought: DistributionChannelType[]
  new_information_product: {
    retail_price?: number
  }
  is_owner: boolean
  variants: VariantDataDetailType[]
  variants_count: number
  attributes: AttributeDetailType[]
}

export interface VariantDetailResponseType {
  data: VariantDetailType
  errors?: any
}
