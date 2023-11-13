export interface OptionDetailType {
  name: string
  option: string
}

// export interface SubmitUpdateVariantType {
//   options: OptionDetailType
//   name: string
//   description: string
//   thumbnail: string
//   images: string[]
//   price: number
// }
export interface AttributeOptionInProductDetailType {
  attribute: string
  option: string
}
export interface CategoryInVariantType {
  id: number
  name: string
  parent_category: []
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
export interface ProductDataType {
  id: number
  name: string
  brand?: BrandInVariantType
  category: CategoryInVariantType
  manufacturer?: ManufacturerInVariantType
  code: string
  description: string | null
  longDescription?: string | null
  is_owner: boolean
  images: string[]
  thumbnail?: string | null
  unit_type: string
}
export interface ManufacturerBrandDetailType {
  id: number
  name: string
  logo: string | null
}
export interface CategoryDetailType {
  id: number
  name: string
  is_displayed: boolean
  child_category?: CategoryDetailType[]
  parent_category?: CategoryDetailType
}
export interface DistributionChannelType {
  id: number
  name?: string
  price: number
}
export interface VariantDetailType {
  id: number
  name: string
  distribution_channels: DistributionChannelType[]
  unit_type?: string
  description: string | null
  longDescription: string
  images: string[]
  thumbnail?: string
  code: string
  attribute_options: AttributeOptionInProductDetailType[]
  on_market: boolean

  product: ProductDataType
  wholesale_price: number
  weight?: number
  uom?: { id: number; name: string }
  brand?: ManufacturerBrandDetailType
  bar_code?: string | null
  manufacturer?: ManufacturerBrandDetailType
  category?: CategoryDetailType
  documents?: string[]
  category_marketplace?: {
    id: number
    name: string
  }
}

export interface VariantDetailResponseType {
  data: VariantDetailType
  errors?: any
}
export interface AttributeOptionSubmitType {
  name: string
  option: string
}

export interface SubmitUpdateVariantType {
  name: string

  description: string | null
  images: string[]
  distribution_channels: DistributionChannelType[]
  on_market: boolean
  thumbnail: string | null
  options?: AttributeOptionSubmitType[] | []
  longDescription: string
  brand?: string
  manufacturer?: string
  category?: string
  category_marketplace?: number
  bar_code?: string | null
  unit_type?: string
  weight?: number
  uom?: number
  price: number
  documents?: string[]
}
export interface SubmitUpdateWithoutVariantType {
  name: string
  description: string | null
  distribution_channels: DistributionChannelType[]
  images: string[]
  thumbnail: string | null
  longDescription: string | null
  brand?: number
  bar_code?: string | null
  manufacturer?: number
  category: number
  on_market: boolean
  category_marketplace: number
  unit_type?: string
  weight?: number
  uom?: number
  price: number
  documents?: string[]
}
export interface AddBrandManufacturerType {
  name: string
  logo: string | null
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
export interface AddBrandManufacturerType {
  name: string
  logo: string | null
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
export interface ValidateCategoryType {
  name: string
  parent_category?: number | null
}
export interface DropdownDataType {
  id: number
  name: string | undefined
}
export interface AddCategoryType {
  name: string
  parent_category?: string
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

export interface ListUOMType {
  id: number
  name: string
}
export interface ListUOMResponseType {
  data: ListUOMType[]
  errors?: any
}
