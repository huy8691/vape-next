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
  code?: string
  description?: string
  longDescription?: string
  price?: number
  unit_type?: string
  inStock: number
  stockAll: number
  is_favorite?: boolean
  organization: OrganizationType
  distribution_channel: {
    id: number
    name: string
    code: string
  }
  category: {
    id: number
    name: string
    parent_category?: {
      id: number
      name: string
    }
  }
  category_marketplace: {
    id: number
    name: string
  }
}
export interface OrganizationInfoType {
  id: number
  name: string
}
export interface ProductDetailResponseType {
  data?: ProductDetailType
  errors?: any
}
export interface OrganizationType {
  id: number
  code: string
  name: string
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
  is_favorite: boolean
  min_price?: number
  max_price?: number
}

export interface ProductListDataResponseType {
  data?: ProductDataType[]
  total?: number
  errors?: any
}

export interface WishListDataType {
  id: number
}
export interface WishListResponseType {
  data?: WishListDataType
  message?: string
  errors?: any
  productId?: number
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

export interface AdjustInstockType {
  product: number
  warehouse: number
  quantity: number
}

// export interface InstockProductType {
//   inStock?: number
// }

// export interface InstockProductDataResponseType {
//   data?: InstockProductType[]
// }
export interface BrandManufacturerDetailType {
  id: number
  name: string
  logo: string
}

export interface ParentCategoryType {
  id: number
  name: string
  organization_info: OrganizationInfoType

  is_displayed: boolean
}
export interface CategoryType {
  id: number
  name: string
  organization_info: OrganizationInfoType

  parent_category: ParentCategoryType
}
export interface AttributeOptionType {
  attribute: string
  option: string
}
export interface DistributionDetailType {
  id: number
  name: string
  price: number
  price_discount?: number
  code: string
}
export interface ProductVariantType {
  variant_id: number
  variant_name: string
  variant_description: string
  variant_longDescription: string
  variant_thumbnail: string
  variant_images: string[]
  variant_code: string
  attribute_options: AttributeOptionType[]
  stockAll: number
  price: number
  is_favorite: boolean
  distribution_channels: DistributionDetailType[]
}
export interface ProductDetailWithVariant {
  id: number
  name: string
  description: string | null
  longDescription: string | null
  thumbnail: string
  code: string
  brand: BrandManufacturerDetailType
  manufacturer: BrandManufacturerDetailType
  category: CategoryType
  category_marketplace: {
    id: number
    name: string
  }
  unit_type: string
  images: string[]
  status: boolean
  updateDate: string
  is_favorite: boolean
  product_variant: ProductVariantType[]
}

export interface ProductDetailWithVariantResponseType {
  data: ProductDetailWithVariant
  errors?: any
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

export interface DistributionOfProductType {
  id: number
  name: string
  code: string
  is_default: boolean
  price: number
}

export interface DistributionOfProductResponseType {
  data: DistributionOfProductType[]
  errors?: any
}
