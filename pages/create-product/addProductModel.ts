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

  description: string
  longDescription: string
  thumbnail: string
}

export interface CreateProductDataType {
  name: string
  brand: number
  manufacturer: number
  unit_type: string
  price: number
  category: number

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

  indeterminate?: boolean
  child_category: ProductCategoryType[]
  parent_category: ProductCategoryType
}

export interface ProductCategoryResponseType {
  data?: ProductCategoryType[]

  errors?: any
}

// brand
export interface ProductBrandType {
  id: number
  name: string
  logo: string
}
export interface AddBrandType {
  name: string
  logo: string
}

export interface ProductBrandResponseType {
  data?: ProductBrandType[]

  errors?: any
}

// manufacturer
export interface ProductManufacturerType {
  id: number
  name: string
  logo: string
}
export interface AddManufacturerType {
  name: string
  logo: string
}
export interface ProductManufacturerResponseType {
  data?: ProductManufacturerType[]
  errors?: any
}
