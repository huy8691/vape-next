import { ReactElement } from 'react'

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
}

export interface OrderDataType {
  id: number
  name: string
  code: string
  thumbnail: string
  quantity: number
  unit_price: number
  unit_type: string
  total: number
}

export interface OrderDetailTypeResponseType {
  data?: OrderDetailType
  errors?: any
}
