export interface DropdownDataType {
  id: number
  name: string | undefined
  //   logo: string
}

export interface AddFormInput {
  product_name: string
  brand: string
  manufacturer: string
  unit_type: string
  price: string
  parent_category: string
  category: string
  short_description: string
  overview: string
}
