export interface ProductDetailType {
  id: number
  name: string
  brand?: {
    name: string
    logo: string
  }
  manufacturer?: {
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
  category?: {
    id: number
    name: string
    parent_category: {
      id?: number
      name?: string
    }
  }
  on_market: boolean

  warehouses: WarehouseType[]
  is_active: boolean
  is_owner: boolean
  distribution_channels_sales: DistributionChannelType[]
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

export interface UpdateProductDataType {
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
  category_marketplace?: number
  documents?: string[]
  on_market: boolean
  warehouses: [
    {
      warehouse: number
      quantity: number
    }
  ]
}
