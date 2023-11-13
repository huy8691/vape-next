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
  category_marketplace: {
    id: number
    name: string
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
  variants: VariantDetailType[]
  variants_count: number
  attributes: AttributeDetailType[]
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

// list product
export interface ProductDataType {
  id: number
  name: string
  thumbnail: string
  price: number
  unit: string
  code: string
  unit_type: string
}

export interface AttributeOptionInProductDetailType {
  attribute: string
  option: string
}
export interface VariantDetailType {
  id: number
  code: string
  description: string | null
  images: string[]
  quantity: number
  thumbnail: string | null
  name: string
  retail_price: number | null
  is_active: boolean
  low_stock_level: number
  attribute_options: AttributeOptionInProductDetailType[]
}

export interface ProductListDataResponseType {
  data?: ProductDataType[]
  total?: number
  errors?: any
}

export interface DistributionType {
  id: number
  name: string
  code: string
}
export interface DistributionResponseType {
  data: DistributionType[]
  errors?: any
}

export interface AdjustInstockType {
  product: number
  warehouse: number
  quantity: number
  reason: string
  description: string
}
export interface ReasonType {
  id: number
  name: string
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

export interface QuantityProductInWarehouseType {
  quantity: number
  quantity_order: number
  quantity_available: number
}
export interface QuantityProductInWarehouseResponseType {
  data: QuantityProductInWarehouseType
  errors?: unknown
}

// export interface InstockProductType {
//   inStock?: number
// }

// export interface InstockProductDataResponseType {
//   data?: InstockProductType[]
// }

export interface RetailPriceDataType {
  retail_price: number
}

export interface SetRetailPriceDataResponseType {
  success: boolean
  status: string
  message: string
  data: RetailPriceDataType[]
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

export interface LowStockDataType {
  low_stock_alert_level: string
}

export interface OptionNameType {
  name: string
  option: string
  options?: OptionDetailType[]
}
interface WarehouseSubmitType {
  warehouse: number
  quantity?: number
}
export interface AddNewOptionType {
  option_array: OptionNameType[]
  warehouses: WarehouseSubmitType[]
  price: number | string
  distribution_channel: DistributionAndPriceType[]
  images: string[]

  thumbnail: string
}
export interface OptionDetailType {
  id: number
  name: string
}
export interface AttributeType {
  id: number
  name: string
  organization: string
  options: OptionDetailType[]
}
export interface AttributeResponseType {
  data: AttributeType[]
  totalPages?: number
  errors?: any
  totalItems?: number
  currentPage?: number
  previousPage?: number
  nextPage?: number
}

export interface DistributionType {
  id: number
  name: string
  code: string
}
export interface DistributionResponseType {
  data: DistributionType[]
  errors?: any
}
export interface AttributeWithOptionType {
  name: string
  option: string
}
export interface DistributionAndPriceType {
  id: number
  price: number
}
export interface CreateVariantType {
  options: OptionNameType[]

  warehouses: WarehouseSubmitType[]
  thumbnail: string | null
  images: string[]
  distribution_channel: DistributionAndPriceType[]
}
export interface SubmitAddNewProductVariantType {
  product: number
  variant: CreateVariantType
}
export interface SubmitUpdateAttributeType {
  name: string
}
