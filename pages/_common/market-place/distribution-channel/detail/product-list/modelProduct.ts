export interface ProductData {
  id: number
  name: string
  description: string
  longDescription: string
  price: number
  thumbnail: string
  code: string
  updated_at: string
  brand: {
    id: number
    name: string
    logo: string
  }
  category: {
    id: number
    name: string
    is_displayed: boolean
  }
  manufacturer: {
    id: number
    name: string
    logo: string
  }
  // brand: string
  // category: string
  // manufacturer: string
  stockAll: number
  unit_type: string
  is_active: boolean
  images: Array<string>
  new_information_product: {
    retail_price?: number
  }
  warning_low_stock_alert: boolean
  variants_count: number
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

// category
export interface ProductCategoryType {
  id: number
  name: string
  child_category: ProductCategoryType[]
  parent_category: ProductCategoryType
}

export interface ProductCategoryResponseType {
  data: ProductCategoryType[]
  totalPages?: number
  errors?: any
  currentPage?: number
  nextPage?: number | null
  totalItems?: number
}

// brand
export interface ProductBrandType {
  id: number
  name: string
  logo: string | null
}
export interface ProductBrandResponseType {
  data: ProductBrandType[]
  totalPages?: number
  errors?: any
  currentPage?: number
  nextPage?: number | null
  totalItems?: number
}

// manufacturer
export interface ProductManufacturerType {
  id: number
  name: string
  logo: string
}

export interface ProductManufacturerResponseType {
  data: ProductManufacturerType[]
  totalPages?: number
  errors?: any
  currentPage?: number
  nextPage?: number | null
  totalItems?: number
}

export interface WarehouseBelongtoUserType {
  id: number
  name: string
  is_active: boolean
  address: string
}

export interface WarehouseBelongtoUserResponseType {
  data: WarehouseBelongtoUserType[]
  error: any
}

export interface RetailInformationType {
  name: string
  description: string | null
  longDescription: string | null
  images: string[]
  thumbnail: string
  retail_price: number | null
}

export interface WarehouseType {
  id: number
  name: string
  quantity: number
}
export interface WarehouseFromVariantType {
  id: number
  name: string
  quantity: number
}
export interface DistributionDetailType {
  id: number
  name: string
}
export interface DistributionChannelType {
  id: number
  name: string
  code: string
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
}
export interface VariantDetailResponseType {
  data: VariantDetailType
  errors?: any
}
