export interface CartType {
  amountItems: number
  cartId?: number
  totalPrice?: number
  items?: CartItem[]
}

export interface CartItem {
  productCode: string
  cartItemId: number
  productId: number
  productName: string
  productThumbnail: string
  quantity: number
  subTotal: number
  unitPrice: number
  unitType: string
  isCheck: boolean
}

export interface CartResponseType {
  data: CartType
}
