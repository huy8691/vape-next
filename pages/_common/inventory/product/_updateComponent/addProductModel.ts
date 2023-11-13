export interface AddBrandManufacturerType {
  name: string
  logo: string | null
}
export interface AddCategoryType {
  name: string
  parent_category?: string
}
export interface DistributionWithPriceType {
  id: number
  price: number
}
export interface AddProductType {
  name: string
  brand?: number
  manufacturer?: number
  category: number
  category_marketplace?: number
  unit_type: string
  description: string | null
  longDescription: string | null
  documents?: string[]
  // this field is base price not the price in each dc
  bar_code?: string | null
  price: number
  uom?: number
  weight?: number
  images: string[]
  thumbnail?: unknown
  distribution_channel?: DistributionWithPriceType[]
  // have_variant: boolean
  warehouses: any
  on_market: boolean
}
export interface AttributeType {
  id: number
  name: string
  options: []
}
export interface AttributeResponseType {
  data: AttributeType[]
  totalPages?: number
  errors?: unknown
  currentPage?: number
  nextPage?: number | null
  totalItems?: number
}
export interface DistributionType {
  id: number
  name: string
  code: string
}
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

export interface WarehouseSubmitType {
  warehouse: number
  quantity?: number
}
export interface ValidateCreateProductDataType {
  name: string
  brand?: string
  manufacturer?: string
  unit_type: string
  category: string
  category_marketplace?: number
  description: string
  longDescription: string
  thumbnail?: string
  images: string[]
  warehouses: WarehouseSubmitType[]
  documents: string[]
  price: number
  weight?: number
  uom?: number
  bar_code?: string | null
  distribution_channel?: DistributionWithPriceType[]
  on_market: boolean
}

// Warehouse
export interface WarehouseType {
  id: number
  name: string
  is_active: boolean
  address: string
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
export interface ValidateCategoryType {
  name: string
  parent_category?: number | null
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

export interface ProductCategoryOnMarketPlaceDetailType {
  id: number
  name: string
}
export interface ProductCategoryOnMarketPlaceResponseType {
  data: ProductCategoryOnMarketPlaceDetailType[]
  totalPages?: number
  errors?: any
  currentPage?: number
  nextPage?: number | null
  totalItems?: number
}
