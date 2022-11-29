export interface InstockType {
  id?: number
  inStock?: number
}

export interface InstockResponseType {
  data?: InstockType
}

export interface UpdateQuantityType {
  quantity?: number
}
export interface invalidCartItemType {
  productId: number
  productName?: string
  errorMessage?: string
}

export type ArrayCartItem = (number | undefined)[]
