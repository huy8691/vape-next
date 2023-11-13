export interface CreateProductDataType {
  name: string
  brand?: number
  manufacturer?: number
  unit_type: string
  price: number
  category: number
  description: string | null
  longDescription: string | null
  thumbnail?: string
  images: string[]
  warehouses: [
    {
      warehouse: number
      quantity: number
    }
  ]
  documents?: string[]
  weight?: number
  uom?: number
  on_market: boolean

  distribution_channel?: DistributionWithPriceType[]
}
export interface DistributionWithPriceType {
  id: number
  price: number
}
export interface SubmitCreateProductVariant {
  name: string
  brand?: number
  manufacturer?: number
  unit_type: string
  price: number
  category: number
  description: string | null
  longDescription: string | null
  thumbnail?: string
  images: string[]
  documents?: string[]
  attributes: CreateAttributesOptionType[]
  on_market?: boolean
  options_warehouse_distribution: CreateVariantType[]
}
export interface CreateAttributesOptionType {
  name: string
  options: string[]
}

export interface ValidateCreateAttributesOptionsType {
  attribute: CreateAttributesOptionType[]
}
export interface CreateVariantType {
  variant_name: string[]
  price: number
  warehouses: WarehouseSubmitType[]
  thumbnail?: string
  images: string[]
  weight?: number
  uom?: number
  on_market?: boolean

  distribution_channel?: DistributionWithPriceType[]
}

export interface CreateVariantArrayType {
  variant_array: CreateVariantType[]
}
interface WarehouseSubmitType {
  warehouse: number
  quantity: number
}
