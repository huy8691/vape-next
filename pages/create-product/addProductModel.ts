export interface DropdownDataType {
  id: number
  name: string | undefined
  //   logo: string
}

export interface AddFormInput {
  name: string
  brand: number
  manufacturer: number
  unit_type: string
  price: number
  category: number
  // child_category: number
  description: string
  longDescription: string
  thumbnail: string
}

export interface RegisterResponseType {
  data: AddFormInput
}

export interface ProductCategoryType {
  id: number
  name: string
  is_displayed: boolean
  checked?: boolean
  indeterminate?: boolean
  child_category: ProductCategoryType[]
  parent_category: ProductCategoryType[]
}

export interface ProductCategoryResponseType {
  data?: ProductCategoryType[]
  totalPages?: number
  errors?: any
}

// brand
export interface ProductBrandType {
  id: number
  name: string
  logo: string
  checked?: boolean
}

export interface ProductBrandResponseType {
  data?: ProductBrandType[]
  totalPages?: number
  errors?: any
}

// manufacturer
export interface ProductManufacturerType {
  id: number
  name: string
  logo: string
  checked?: boolean
}

export interface ProductManufacturerResponseType {
  data?: ProductBrandType[]
  totalPages?: number
  errors?: any
}
