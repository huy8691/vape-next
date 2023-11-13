export interface CartType {
  amountItems: number
  cartId?: number
  totalPrice?: number
  items?: CartItem[]
}

export interface AttributeOptionType {
  attribute: string
  option: string
}
export interface ProductDetailType {
  id: number
  name: string
}
export interface CartItem {
  productCode: string
  cartItemId: number
  productId: number
  productName: string
  productThumbnail: string
  product: ProductDetailType
  quantity: number
  subTotal: number
  unitPrice: number
  price_discount?: number
  unitType: string
  isCheck: boolean
  attribute_options: AttributeOptionType[]
}

export interface CartResponseType {
  data: CartType
}
