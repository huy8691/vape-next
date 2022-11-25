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

export type DeletedArrayCartItem = (number | undefined)[]
