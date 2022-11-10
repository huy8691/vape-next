export interface CartType {
  amountItems?: number
  cartId?: number
  totalPrice?: number
  items?: []
}
export interface CartResponseType {
  data: CartType
}
