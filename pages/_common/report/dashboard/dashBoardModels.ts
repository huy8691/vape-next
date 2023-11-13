// SalesTrend
export interface SalesTrendListResponseType {
  data: {
    month: number
    total: number
  }[]
}
// OrdersTrend
export interface OrdersTrendListResponseType {
  data: {
    month: number
    numOrder: number
  }[]
}

// BestSeller
export interface BestSellerListResponseType {
  data: {
    id: number
    sold_quantity: number
    name: string
  }[]
}

// Orders
export interface OrdersListResponseType {
  data: {
    id: number
    code: string
    date: string
    status: string
    payment_status: string
    total: number
    type: string
  }[]
  totalPages: number
}
export interface ProductDetailType {
  id: number
  name: string
  thumbnail: string
  stock: string
  low_stock_alert: string
  unit: string
  is_own?: boolean
  dc_id: number
}
export interface ProductListResponseType {
  data: ProductDetailType[]
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
