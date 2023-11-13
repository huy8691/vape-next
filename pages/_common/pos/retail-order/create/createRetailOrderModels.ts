export interface ProductDataType {
  id: number
  name: string
  thumbnail: string
  code: string
  category?: {
    id: number
    name: string
    is_displayed: boolean
  }
  product_id?: number
  retail_price?: number
  min_retail_price?: number
  max_retail_price?: number
  edited_price?: number
  instock?: number
  variants_count?: number
  tempQuantity?: number
  isSelected?: boolean
  is_active: boolean
  isInvalid?: boolean
  // field for product variant detail
  quantity?: number
  attribute_options?: AttributeOptionInProductDetailType[]
  isAllowed?: boolean
  //! new flow for retail order by vyx
  base_price?: number
  price_discount?: number
  apply_voucher_price?: number
}
export interface VariantDetailType {
  id: number
  code: string
  description: string | null
  images: string[]
  quantity: number
  thumbnail: string
  name: string
  retail_price: number
  edited_price?: number

  tempQuantity?: number
  isSelected?: boolean
  is_active: boolean
  isInvalid?: boolean
  attribute_options: AttributeOptionInProductDetailType[]
}
export interface ListProductDataType {
  data: ProductDataType[]
  totalPages?: number
  errors?: any
  totalItems: number
  currentPage: number
  previousPage: number | null
  nextPage: number | null
}

export interface CategoryDataType {
  id: number
  name: string
  child_category: CategoryDataType[]
  parent_category: CategoryDataType
}

export interface CategoryListDataResponseType {
  data: CategoryDataType[]
  totalPages?: number
  errors?: any
  currentPage?: number
  nextPage?: number | null
  totalItems?: number
}

// brand
export interface BrandDataType {
  id: number
  name: string
  logo: string | null
}
export interface BrandListDataResponseType {
  data: BrandDataType[]
  totalPages?: number
  errors?: any
  currentPage?: number
  nextPage?: number | null
  totalItems?: number
}

// manufacturer
export interface ManufacturerDataType {
  id: number
  name: string
  logo: string
}

export interface ManufacturerListDataResponseType {
  data: ManufacturerDataType[]
  totalPages?: number
  errors?: any
  currentPage?: number
  nextPage?: number | null
  totalItems?: number
}

export interface ProductRetailType {
  product_variant: number
  quantity: number
  price?: number
  price_discount?: number
}
export interface OtherProductType {
  product_name: string
  quantity: number
  price: number
  total?: number
  unit: string
}
export interface createRetailOrderType {
  shipping_method: number
  payment_method: number
  items: ProductRetailType[]
  other_products?: OtherProductType[]
  phone_number?: string
  voucher_code?: string
  round_up?: boolean
  apply_type?: string
}
export interface ProductCategoryType {
  id: number
  name: string

  child_category: ProductCategoryType[]
  parent_category?: {
    id: number
    name: string
  }
}

export interface ProductCategoryResponseType {
  data: ProductCategoryType[]
  totalPages?: number
  errors?: any
  currentPage?: number
  nextPage?: number | null
  totalItems?: number
}

// brand
export interface ProductBrandType {
  id: number
  name: string
}

export interface ProductBrandResponseType {
  data: ProductBrandType[]
  totalPages?: number
  errors?: any
  currentPage?: number
  nextPage?: number | null
  totalItems?: number
}

// manufacturer
export interface ProductManufacturerType {
  id: number
  name: string
}

export interface ProductManufacturerResponseType {
  data: ProductManufacturerType[]
  totalPages?: number
  errors?: any
  currentPage?: number
  nextPage?: number | null
  totalItems?: number
}

export interface InvalidItemRetailOrderType {
  errorMessage: string
  productId: string
  productName: string
}
export interface WarehouseType {
  id: number
  name: string
  quantity: number
}
export interface DistributionChannelType {
  id: number
  name: string
  code: string
}
export interface AttributeOptionInProductDetailType {
  attribute: string
  option: string
}

export interface OptionDetailType {
  id: number
  name: string
}
export interface AttributeDetailType {
  id: number
  name: string
  options: OptionDetailType[]
}
export interface ProductVariantDetailType {
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
  code: string
  description?: string
  longDescription?: string
  unit_type?: string
  instock: number
  available_stock: number
  quantity_order: number
  category: {
    id: number
    name: string
    parent_category: {
      id?: number
      name?: string
    }
  }
  low_stock_alert_level: number

  is_active: boolean

  is_owner: boolean
  variants: ProductDataType[]
  variants_count: number
  attributes: AttributeDetailType[]
}
export interface ProductDetailVariantResponseType {
  data?: ProductVariantDetailType
  errors?: any
}

// new phrase
export interface CashPaymentType {
  cash: number
}
export interface CreditCardPaymentType {
  credit: number
}

export interface ResponseCreateRetailOrderType {
  code: string
  id: number
  items: ProductDataType[]
  other_product: OtherProductType[]
  tip?: number
  order_total: number
  total: number
  round_up?: number
}
export interface BillingSummaryType {
  code: string
  items: ProductRetailType[]
  other_product: OtherProductType[]
  tip?: number
  subtotal: number
}
export interface ResponseCreateRetailOrderResponseType {
  data: ResponseCreateRetailOrderType
  errors?: any
}
export interface SubmitCashPaymentType {
  retail_order: number
  amount: number
  change: number
  tip?: number | string | null
}

export interface CustomerType {
  customer_id: number
}
export interface CustomerResponseType {
  data: CustomerType
  errors: any
}

export interface BusinessProfileType {
  logo: string
  business_name: string
  website_link_url: string
  address: string
  city: string
  state: string
  postal_zipcode: string
  custom_tax_rate: string
  federal_tax_id: string
  business_tax_document: string
  vapor_tobacco_license: string
}

export interface BusinessResponseType {
  data: BusinessProfileType
  error?: any
}

// export interface ReceiptSummaryType {
//   code: string
//   items: ProductRetailType[]
//   other_product: OtherProductType[]
//   tip?: number
//   subtotal: number
// }
export interface ProductListInRetailOrderType {
  name: string
  quantity: number
  total: number
}
export interface OtherProductInRetailOrderType {
  product_name: string
  quantity: number
  total: number
}
export interface RetailOrderDetailType {
  code: string
  order_date: string
  items: ProductListInRetailOrderType[]
  other_products: OtherProductInRetailOrderType[]
  total_billing: number
  total_tip: number
  total_value: number
}

export interface RetailOrderDetailResponseType {
  data: RetailOrderDetailType
  errors?: any
}
export interface ProductFromBarcodeResponseType {
  data: ProductFromBarcodeType[]
  errors?: any
}
export interface ProductFromBarcodeType {
  id: number
  name: string
  brand: {
    id: number
    name: string
    logo: string
  }
  manufacturer: {
    id: number
    name: string
    logo: string
  }
  thumbnail: string
  images: string[]
  code: string
  category: {
    id: number
    name: string
    is_displayed: boolean

    parent_category: {
      id: number
      name: string
      is_displayed: boolean

      organization_info: {
        id: number
        name: string
      }
    }
  }
  category_marketplace: {
    id: number
    name: string
    parent_category: {
      id: number
      name: string
      is_displayed: boolean
    }
    is_displayed: boolean
  }
  unit_type: string
  instock: number
  variants_count: number
  retail_price: number
  is_active: boolean
}

export interface ListProductDiscountType {
  id: number
  price: number
  price_discount: number | null
}

export interface ListProductDiscountResponseType {
  data: ListProductDiscountType[]
  limit: number
  totalPages: number
  currentPage: number
  totalItems: number
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
  general_discount: DiscountType | null
  specific_discount: SpecificDiscountType[]
  loyalty_info: LoyaltyInfoType
}

export interface VoucherCodeType {
  voucher_code: string
}

export interface DetailVoucherByCodeType {
  id: number
  title: string
  code: string
  type: string
  discount_amount: number
  max_discount_amount: number | null
  minimum_spend: number
  start_date: string
  expiry_date: string
  limit_per_voucher: number
  limit_per_user: number
  product_coverage: string
  status: string
  availability: string[]
  specific_products: {
    id: number
    thumbnail: string
    name: string
    code: string
    product_id: number
    have_variant: boolean
  }[]
}
export interface DetailVoucherByCodeResponseType {
  data: DetailVoucherByCodeType
  errors?: any
}
