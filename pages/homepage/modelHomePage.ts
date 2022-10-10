export interface ProductDataType {
  id: number
  name: string
  thumbnails: Array<{ url: string }>
  prices: Array<{ price: number }>
  unit: string
}

export interface ProductListDataResponseType {
  data?: ProductDataType[]
  errors?: any
}

// category
export interface CategoryProductDataType {
  name: string
  image: string
}

export interface CategoryProductListDataResponseType {
  data?: CategoryProductDataType[]
  errors?: any
}

// promotion
export interface PromotionDataType {
  name: string
  featureImage: { url: string }
  from?: string
  to?: string
}

export interface PromotionListDataResponseType {
  data: PromotionDataType[]
  errors?: any
}

// outstanding farm

export interface OutstandingFarmDataType {
  isFake: boolean
  supplier?: {
    name: string
    avatar: string | any
    address: string
    totalProducts: number
  }
}

export interface OutstandingFarmListDataResponseType {
  data: OutstandingFarmDataType[]
  errors?: any
}
