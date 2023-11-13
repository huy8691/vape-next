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
  low_stock_level: number
  unit_type: string
  warehouses: { id: number; name: string }[]
}
export interface VariantDetailResponseType {
  data: VariantDetailType
  errors?: any
}

export interface RetailPriceDataType {
  retail_price: number
}
export interface WarehouseStoreProductFromTwssType {
  id: number
  name: string
  quantity: number
}
export interface ProductFromTwssType {
  id: number
  name: string
  warehouses: WarehouseStoreProductFromTwssType[]
}
export interface DetailProductByInvoiceDetailType {
  Description: string
  Quantity: string
  Price: string
  Line_Amount: string
  products: ProductFromTwssType[]
}

export interface ListProductByInvoiceType {
  table: DetailProductByInvoiceDetailType[]
}

export interface ListProductByInvoiceResponseType {
  data: ListProductByInvoiceType
  errors?: any
}

export interface WarehouseType {
  warehouse: number
  quantity: number
}
export interface SubmitListProductByInvoiceType {
  isCreate: boolean
  checked: boolean
  product?: number
  name?: string
  price?: number
  category?: string
  brand?: string
  unit_type?: string
  warehouses: WarehouseType[]
}
export interface ValidateCreateUpdateProductOCRType {
  list_product: SubmitListProductByInvoiceType[]
}

export interface WarehouseType {
  id: number
  name: string
  is_active: boolean
  address: string
}
export interface WarehouseResponseType {
  data: WarehouseType[]
  errors?: any
}

export interface ValidateCategoryType {
  name: string
  parent_category?: number | null
}

export interface CreateProductDetailType {
  name: string
  unit_type: string
  category: number
  brand: number
  warehouses: SubmitWarehouse[]
  price: number
}

export interface UpdateProductDetailType {
  product: number
  warehouse: number
  quantity: number
}

export interface SubmitCreateUpdateOCR {
  update_products?: UpdateProductDetailType[]
  create_products?: CreateProductDetailType[]
}

export interface SubmitWarehouse {
  warehouse: number
  quantity: number
}
