export interface purchaseOrderTypeData {
  id: number
  code: string
  status: string
  delivery_fee: string
  notes: string
  order_date: string
  sub_total: number
  total_billing: string
  recipient_name: string
  phone_number: string
  address: string
  payment_method: {
    id: number
    name: string
  }
  shipping_method: {
    id: number
    name: string
  }
  items: OrderDataType[]
  other_products: OtherProductDetailType[]
  contact: {
    id: number
    phone_number: string
    email: string
    first_name: string
    last_name: string
    business_name: string
    federal_tax_id: string
    address: string
    city: string
    state: string
    postal_zipcode: string
  }
  seller: {
    avatar: string
    email: string
    name: string
    phone_number: string | undefined
  }
}

export interface OtherProductDetailType {
  product_name: string
  price: number
  quantity: number
  total: number
  unit: string
}
export interface WarehouseType {
  id: number
  name: string
  address: string
  quantity: number
}

export interface WarehouseAndQuantityType {
  warehouse: {
    id: number
    name: string
    address: string
    is_default: boolean
  }
  quantity: number
  isChecked?: boolean
}

export interface AttributionAndOptionDetailType {
  attribute: string
  option: string
}

export interface ProductVariantDetail {
  id: number
  name: string
}
export interface OrderDataType {
  id: number
  name: string
  code: string
  attribute_options?: AttributionAndOptionDetailType[]
  purchase_order_item_id: number
  thumbnail: string
  quantity: number
  unit_price: number
  unit_type: string
  total: number
  isSelected?: boolean
  warehouse_quantity?: WarehouseWithQuantityType[]
  missing?: number
  product_id: number
}
export interface WarehouseWithQuantityType {
  warehouse: number
  quantity: number | string
}
export interface purchaseOrderResponseTypeData {
  success: boolean
  statusCode: number
  message: string
  totalItems: number
  currentPage: number
  totalPages: number
  limit: number
  previousPage: string
  nextPage: string
  data: purchaseOrderTypeData[]
}
export interface purchaseOrderDetail {
  success: boolean
  status: number
  message: string
  data: purchaseOrderTypeData
}

export interface WarehouseAndQuantityDataType {
  purchase_order_item?: number
  warehouse_quantity: WarehouseWithQuantityType[]
}

export interface WarehouseAndQuantityResponseType {
  data: WarehouseAndQuantityType[]
  errors?: any
}
export interface ValidateWarehouseType {
  items: WarehouseAndQuantityDataTestType[]
}

export interface WarehouseAndQuantityDataTestType {
  purchase_order_item?: number
  warehouse_quantity?: WarehouseWithQuantityType[]
}
