export interface CartType {
  amountItems?: number
  cartId?: number
  totalPrice?: number
  items?: Array<{
    cartItemId: number
    productName: string
    productThumbnail: string
    quantity: number
    subTotal: number
    unitPrice: number
    unitType: string
  }>
}
export interface CartResponseType {
  data: CartType
}
