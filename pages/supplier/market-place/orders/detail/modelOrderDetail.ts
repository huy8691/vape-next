export interface ShippingInformationType {
  delivery_fee: number
  ship_date: string
  service: {
    name: string
    code: string
    logo: string
  }
  shipping_address: {
    address: string
    city: string
    receiver: string
    postal_zipcode: string
  }
}

export interface PaymentTermType {
  due_amount: number
  due_date: Date
  payment_term: number
}
export interface OrderDetailType {
  id: number
  code: string
  order_date: string
  status: string
  notes: string
  delivery_fee: number
  payment_status: string
  sub_total: number
  total_billing: number
  //   receiver_name: string
  shipping_address: {
    receiver_name: string
    address_name: string
    phone_number: string
    address: string
  }
  shipping_method: string
  payment_method: string
  items: OrderDataType[]
  history_actions: HistoryType[]
  cash: number
  credit: number
  recipient: {
    avatar: string
    email: string
    name: string
  }
  shipping_information: ShippingInformationType
  loyalty_discount_price: number
  payment_term: PaymentTermType
}
export interface HistoryType {
  action: string
  new_status: string
  old_status: string
  time: string
  type: string
}

export interface ProductVariantDetail {
  id: number
  name: string
}
export interface AttributeAndOptionsType {
  attribute: string
  option: string
}
export interface OrderDataType {
  id: number
  name: string
  code: string
  order_item_id: number
  thumbnail: string
  quantity: number
  unit_price: number
  price_discount?: number
  unit_type: string
  total: number
  isSelected?: boolean
  warehouse_quantity?: WarehouseWithQuantityType[]
  attribute_options: AttributeAndOptionsType[]
  missing?: number
  product: ProductVariantDetail
  is_sample: boolean
}

export interface OrderStatusType {
  id: number
  text: string
  icon: any
  color: string
  textDisplay: string
}

export interface OrderDetailTypeResponseType {
  data?: OrderDetailType
  errors?: any
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

export interface WarehouseAndQuantityResponseType {
  data: WarehouseAndQuantityType[]
  errors?: any
}

export interface ValidateWarehouseType {
  items: WarehouseAndQuantityDataTestType[]
}
export interface WarehouseAndQuantityDataTestType {
  order_item?: number
  warehouse_quantity?: WarehouseWithQuantityType[]
}
export interface WarehouseAndQuantityDataType {
  order_item?: number
  warehouse_quantity: WarehouseWithQuantityType[]
}
export interface WarehouseWithQuantityType {
  warehouse: number
  quantity: number | string
}

export interface CancelOrderType {
  reason: string
}

export interface RefundFormType {
  total_amount: number
  reason?: string | null
}

export interface RefundDetailType {
  cash: number
  credit: number
}
export interface SaveProductRefundDetailType {
  reason?: string | null
  total_amount: number
  items: number[]
  other_products: number[]
  refund_include_tip: boolean
}

export interface ExportOrderType {
  url: string
}
export interface SendEmailType {
  invoice_url: string
}
export interface ExportOrderResponseType {
  data: ExportOrderType
}
