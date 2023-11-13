export interface ListManufacturerType {
  id: number
  name: string
  is_manufacturer: boolean
}
export interface ListManufacturerResponseType {
  data: ListManufacturerType[]
  errors: any
}
export interface SupplierType {
  id: number
  name: string
  is_manufacturer: boolean
}
export interface SupplierResponseType {
  data: SupplierType[]
  totalPages?: number
  errors?: any
}

export interface ProductCategoryOnMarketPlaceResponseType {
  data: { id: number; name: string; thumbnail: string }[]
  totalPages?: number
  errors?: any
  currentPage?: number
  nextPage?: number | null
  totalItems?: number
}
