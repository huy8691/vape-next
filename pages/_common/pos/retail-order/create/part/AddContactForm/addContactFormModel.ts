export interface AddContactType {
  phone_number: string
}
export interface DiscountType {
  type: string
  discount_amount: number
  max_discount_amount?: number
}
export interface SpecificDiscountType {
  discount: DiscountType
  id: number
}
export interface LoyaltyInfoType {
  current_points: number | null
  loyalty_code: string
  tiered_loyalty_level: number | null
  total_points: number | null
}
export interface ContactDetailType {
  id: number
  email: string | null
  phone_number: string
  first_name: string
  last_name?: string
  address: string | null
  business_name: string
  loyalty_info: LoyaltyInfoType
  general_discount: DiscountType | null
  specific_discount: SpecificDiscountType[]
  document?: string | null
}
export interface ContactDetailResponseType {
  data: ContactDetailType
  error?: any
}
export interface ProductVariantType {
  id: number
  name: string
}

export interface ReadLicenseType {
  Name: string
  Address: string
}

export interface ReadLicenseTypeResponse {
  data: ReadLicenseType
  errors?: any
}

// model for upload file
export interface FileType {
  name: string
}

export interface FileListType {
  files: FileType[]
}

export interface UrlUploadResponseType {
  url: string
  newUrl: string
}
