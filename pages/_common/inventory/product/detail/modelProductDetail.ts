export interface AttributeOptionInProductDetailType {
  attribute: string
  option: string
}
export interface ProductDetailType {
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
  price?: number
  unit_type?: string
  stockAll: number
  available_stock: number
  quantity_order: number
  bar_code?: string | null
  category: {
    id: number
    name: string
    parent_category: {
      id?: number
      name?: string
    }
  }
  category_marketplace: {
    id: number
    name: string
  }
  warehouses: WarehouseType[]
  is_active: boolean
  distribution_channels_sales: DistributionChannelType[]
  distribution_channels_bought: DistributionChannelType[]
  new_information_product: {
    retail_price?: number
  }
}
export interface DistributionChannelType {
  id: number
  name: string
  code: string
}
export interface WarehouseType {
  id: number
  name: string
  quantity: number
}
export interface ProductDetailResponseType {
  data?: ProductDetailType
  errors?: any
}

export interface AttributeWithOptionType {
  name: string
  option: string
}

export interface CategoryInVariantType {
  id: number
  name: string
  parent_category: {
    id?: number
    name?: string
  }
  is_displayed: boolean
}
export interface BrandInVariantType {
  id: number
  name: string
  logo: string
}
export interface ManufacturerInVariantType {
  id: number
  name: string
  logo: string
}

export interface AdjustInstockType {
  product: number
  warehouse: number
  quantity: number
  reason: string
  description: string
}
export interface RetailInformationType {
  name: string
  description: string | null
  longDescription: string | null
  images: string[]
  thumbnail: string
  retail_price: number | null
  low_stock_notification_to_supplier: boolean
}
export interface WarehouseFromVariantType {
  id: number
  name: string
  quantity: number
}
export interface ProductDataType {
  id: number
  name: string
  brand: BrandInVariantType
  category: CategoryInVariantType
  manufacturer: ManufacturerInVariantType
  code: string
  description: string | null
  longDescription: string | null
  is_owner: boolean
  images: string[]
  thumbnail: string
  unit_type: string
}
export interface DistributionDetailType {
  id: number
  name: string
  price: number
}

export interface VariantDetailType {
  id: number
  name: string
  product: ProductDataType
  bar_code?: string | null
  unit_type?: string
  description: string | null
  longDescription: string | null
  images: string[]
  thumbnail: string
  code: string
  category: CategoryInVariantType
  category_marketplace: {
    id: number
    name: string
  }
  brand: BrandInVariantType
  manufacturer: ManufacturerInVariantType
  status: boolean
  distribution_channels: DistributionDetailType[]
  attribute_options: AttributeOptionInProductDetailType[]
  low_stock_level: number
  retail_information: RetailInformationType
  warehouses: WarehouseFromVariantType[]
  stock_all: number
  stock_available: number
  stock_on_order: number
  weight: number
  uom: {
    id: number
    name: string
  }
  wholesale_price: number
  documents: string[]
}

export interface VariantDetailResponseType {
  data: VariantDetailType
  errors?: any
}

export interface RetailPriceDataType {
  retail_price: number
}
export interface LowStockDataType {
  low_stock_alert_level: string
  low_stock_notification_to_supplier: boolean
}
export interface LowStockDataSubmitType {
  low_stock_alert_level: number
}

export interface QuantityProductInWarehouseType {
  quantity: number
  quantity_order: number
  quantity_available: number
}
export interface QuantityProductInWarehouseResponseType {
  data: QuantityProductInWarehouseType
  errors?: unknown
}

export interface ReasonType {
  id: number
  name: string
  key: string
}

export interface WarehouseAdjustInstockType {
  id: number
  name: string
  is_active: boolean
  is_default: boolean
  address: string
}
export interface WarehouseAdjustInstockTypeResponseType {
  data: WarehouseAdjustInstockType[]
  errors?: any
}
export interface WarehouseDetailType {
  id: number
  name: string
  quantity: number
}
export interface QuantityOfProductVariantType {
  quantity: number
}

export interface QuantityOfProductVariantResponseType {
  data: QuantityOfProductVariantType
  error?: any
}
export interface SubmitAdjustStock {
  product_variant: number
  warehouse: number
  quantity: number
  reason: string
  description: string | null
}

export interface StockTransactionType {
  id: number
  time: string
  reason: string
  from_stock: number
  to_stock: number
  warehouse: {
    id: number
    name: number
  }
  description: string
}

export interface StockTransactionResponseType {
  data: StockTransactionType[]
  totalPages: number
  currentPage: number
  nextPage: number | null
  previousPage: number | null
  totalItems: number | null
}
export interface WarehouseListDataResponseType {
  data: WarehouseDataType[]
  totalPages?: number
  errors?: any
  totalItems?: number
  currentPage?: number
  previousPage?: number
  nextPage?: number
}

export interface WarehouseDataType {
  id: number
  name: string
  is_active: boolean
  is_default: boolean
  address: string
  description: string
}
export interface AddMultiVariantToCartType {
  product_variant: number
  quantity: number | null
  distribution_channel: number
  stockAll?: number
}
export interface ArrayAddMultiVariantToCartType {
  list_variants: AddMultiVariantToCartType[]
}

export interface SubmitDistributionChannelType {
  distribution_channels: number
}
